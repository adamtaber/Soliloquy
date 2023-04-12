import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import humps from 'humps'
import { JWT_SECRET } from "../../../config"
import { pool } from "../../../db/config"
import { isUser } from "./types"
import { isProduction } from '../../../config'
import { MutationResolvers } from '../graphql-types'

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

    const query = 
      `INSERT INTO user_followers (user_id, follower_id)
       VALUES ($1, $2)
       RETURNING *`
    const values = [followUserId, authorizedId]

    await pool.query(query, values)

    return 'Follow Successful!'
  }
}

export default userMutations