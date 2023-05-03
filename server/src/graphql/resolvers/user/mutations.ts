import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import humps from 'humps'
import { JWT_SECRET } from "../../../config"
import { pool } from "../../../db/config"
import { isUser } from "./types"
import { isProduction } from '../../../config'
import { MutationResolvers } from '../graphql-types'
import { faker } from '@faker-js/faker'

const userMutations: MutationResolvers = {
  createUser: async (_root, args) => {
    const { displayname, username, email, password } = args
    const hash = await argon2.hash(password)
    const createdOn = new Date()

    const query = 
      `INSERT INTO users (displayname, username, 
         email, password, created_on) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`
    const values = [displayname, username, email, hash, createdOn]

    const userMutation = await pool.query(query, values)
    const user = humps.camelizeKeys(userMutation.rows[0])
    
    if (!isUser(user)) {
      throw 'did not retrieve user'
    }

    return user
  },
  updateUser: async (_root, args, { authorizedId }) => {
    const { displayname, username } = args

    if (!authorizedId) {
      throw new Error('not authorized')
    }

    const query = 
      `UPDATE users
       SET displayname = $1,
           username = $2
       WHERE user_id = $3
       RETURNING *`
    const values = [displayname, username, authorizedId]

    const updateMutation = await pool.query(query, values)
    const user = humps.camelizeKeys(updateMutation.rows[0])

    if (!isUser(user)) {
      throw 'did not retrieve user'
    }

    return user
  },
  deleteUser: async (_root, _args, { res, authorizedId }) => {
    if (!authorizedId) {
      throw new Error('not authorized')
    }

    const query =
      `DELETE FROM users
       WHERE user_id = $1`
    const values = [authorizedId]

    await pool.query(query, values)
    
    authorizedId = null
    res.clearCookie('id')

    return true
  },
  login: async (_root, args, { res, authorizedId }) => {
    const { username, password } = args

    if (authorizedId) {
      throw new Error('A user is already logged in')
    }

    const query = 'SELECT * FROM users WHERE username = $1'
    const values = [username]
    const userQuery = await pool.query(query, values)
    const user = humps.camelizeKeys(userQuery.rows[0])

    if (!user || !isUser(user)) {
      throw new Error('User not found')
    }

    const passIsValid = await argon2.verify(user.password, password)

    if (!passIsValid) {
      throw new Error('Password not valid')
    }

    const token = await jwt.sign({userId: user.userId}, JWT_SECRET as string)

    res.cookie("id", token, {
      httpOnly: true,
      secure: true,
      sameSite: isProduction() ? 'lax' : 'none',
      expires: new Date(Date.now() + 8 * 3600000)
    })

    return true
  },
  logout: async (_root, _args, { res, authorizedId }) => {
    if (!authorizedId) {
      throw new Error('User not currently logged in')
    }
    authorizedId = null
    res.clearCookie("id")
    return true
  },
  followUser: async (_root, args, { authorizedId }) => {
    const { followUserId } = args

    if (!authorizedId) {
      throw new Error('not authorized')
    }

    if(followUserId === authorizedId) {
      throw new Error('cannot follow yourself')
    }

    const checkFollow =
      `SELECT user_id
       FROM user_followers
       WHERE user_id = $1 AND follower_id = $2`
    const values1 = [followUserId, authorizedId]
    const checkQuery = await pool.query(checkFollow, values1)

    if(!Array.isArray(checkQuery.rows)) {
      throw new Error('invalid query response')
    }
    
    if(checkQuery.rows.length > 0) {
      throw new Error('you are already following this user')
    }

    const followQuery = 
      `INSERT INTO user_followers (user_id, follower_id)
       VALUES ($1, $2)`
    const values2 = [followUserId, authorizedId]

    await pool.query(followQuery, values2)

    return 'Follow Successful!'
  },
  unfollowUser: async(_root, args, { authorizedId }) => {
    const { userId } = args

    if (!authorizedId) {
      throw new Error('not authorized')
    }

    const query =
      `DELETE FROM user_followers
       WHERE user_id = $1 AND follower_id = $2`
    const values = [userId, authorizedId]

    await pool.query(query, values)

    return true
  },
  generateUsers: async (_root, args) => {
    const { quantity } = args
    const users = []

    for (let i = 0; i < quantity; i++) {
      const displayname = faker.name.fullName()
      const username = `${faker.word.adjective({ length: { min: 3, max: 12 }})}${faker.word.noun({ length: { min: 3, max: 13 }})}`
      const email = faker.internet.email()
      const password = 'password'
      const hash = await argon2.hash(password)
      const createdOn = new Date()

      const query = 
      `INSERT INTO users (displayname, username, 
         email, password, created_on) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`
      const values = [displayname, username, email, hash, createdOn]
      const userMutation = await pool.query(query, values)

      const user = humps.camelizeKeys(userMutation.rows[0])
      
      if (!isUser(user)) {
        throw 'did not retrieve user'
      }

      users.push(user)
    }

    return users
  },
  generateFollowers: async() => {
    const query = 
      `SELECT user_id
       FROM users`
    const userQuery = await pool.query(query)
    const users = humps.camelizeKeys(userQuery.rows)

    if(!Array.isArray(users)) {
      throw new Error('not a user array')
    }

    const quantity = users.length

    for (let i = 0; i < quantity; i++) {
      const userId = users[i].userId
      users.forEach(async user => {
        if(userId !== user.userId) {
          const followQuery = 
          `INSERT INTO user_followers (user_id, follower_id)
          VALUES ($1, $2)`
          const values2 = [user.userId, userId]
          await pool.query(followQuery, values2)
        }
      })
    }

    return true
  }
}

export default userMutations