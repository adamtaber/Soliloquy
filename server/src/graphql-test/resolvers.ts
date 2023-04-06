import { pool } from '../db/config'
import * as argon2 from 'argon2'
import { Resolvers, User } from '../resolvers-types'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import { isProduction } from '../utils'

const isUser = (input: any): input is User => input.user_id !== undefined

export const resolvers: Resolvers = {
  Query: {
    allUsers: async (_root, _, { req }) => {
      const users = await pool.query('SELECT * FROM users')
      console.log('TEST TEST TEST TEST TEST')
      console.log(req.cookies)
      return users.rows
    },
    findUser: async (_root, args) => {
      const { user_id } = args
      const query = 'SELECT * FROM users WHERE user_id = $1'
      const values = [user_id]
      const user = await pool.query(query, values)
      return user.rows[0]
    }
  },
  Mutation: {
    createUser: async (_root, args) => {

      const { displayname, username, email, password } = args
      if (!displayname || !username || !email || !password) {
        throw 'missing params'
      }

      const hash = await argon2.hash(password)
      const created_on = new Date()

      const query = 
        `INSERT INTO users (displayname, username, 
           email, password, created_on) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`
      const values = [displayname, username, email, hash, created_on]

      const userMutation = await pool.query(query, values)
      
      const user = userMutation.rows[0]
      
      if (!isUser(user)) {
        throw 'mutation failed'
      }

      return user
    },
    login: async (_root, args, { res, userId }) => {
      const { username, password } = args

      if (userId) {
        throw new Error('A user is already logged in')
      }

      const query = 'SELECT * FROM users WHERE username = $1'
      const values = [username]
      const userQuery = await pool.query(query, values)
      const user = userQuery.rows[0]

      if (!user || !isUser(user)) {
        throw new Error('User not found')
      }

      const passIsValid = await argon2.verify(user.password, password)

      if (!passIsValid) {
        throw new Error('Password not valid')
      }

      const token = await jwt.sign({user_id: user.user_id}, JWT_SECRET as string)

      res.cookie("id", token, {
        httpOnly: true,
        secure: true,
        sameSite: isProduction() ? 'lax' : 'none',
        expires: new Date(Date.now() + 8 * 3600000)
      })

      return true
    },
    logout: async (_root, _args, { res, userId }) => {
      if (!userId) {
        throw new Error('User not currently logged in')
      }
      userId = null
      res.clearCookie("id")
      return true
    }
  }
}
