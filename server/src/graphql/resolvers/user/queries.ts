import { pool } from "../../../db/config"
import humps from 'humps'
import { isUser, isUserArray } from "./types"
import { QueryResolvers } from "../graphql-types"

const userQueries: QueryResolvers = {
  allUsers: async () => {
    const usersQuery = await pool.query('SELECT * FROM users')
    const users = humps.camelizeKeys(usersQuery.rows)
    
    if(!isUserArray(users)) {
      throw new Error('Users query invalid')
    }

    return users
  },
  currentUser: async (_root, _args, { authorizedId }) => {
    if(!authorizedId) {
      throw new Error('user is not authorized')
    }

    const query = 'SELECT * FROM users WHERE user_id = $1'
    const values = [authorizedId]

    const userQuery = await pool.query(query, values)
    const user = humps.camelizeKeys(userQuery.rows[0])

    if(!isUser(user)) {
      throw new Error('Response does not match user type')
    }

    return user
  },
  findUser: async (_root, args) => {
    const { userId } = args
    const query = 'SELECT * FROM users WHERE user_id = $1'
    const values = [userId]

    const userQuery = await pool.query(query, values)
    const user = humps.camelizeKeys(userQuery.rows[0])

    if(!isUser(user)) {
      throw new Error('User query invalid')
    }

    return user
  },
  getFollowers: async (_root, args ) => {
    const { userId } = args

    const query = 
      `SELECT u.user_id, username, displayname, email, password
       FROM users u
       JOIN user_followers f
       ON u.user_id = f.follower_id
       WHERE f.user_id = $1`
    const values = [userId]

    const followerQuery = await pool.query(query, values)
    const followers = humps.camelizeKeys(followerQuery.rows)

    if (!isUserArray(followers)) {
      throw new Error('Followers query invalid')
    }

    return followers
  },
  getFollowing: async (_root, args) => {
    const { userId } = args

    const query = 
      `SELECT username, u.user_id, displayname, email, password
       FROM users u
       JOIN user_followers f
       ON u.user_id = f.user_id
       WHERE f.follower_id = $1`
    const values = [userId]

    const followingQuery = await pool.query(query, values)
    const following = humps.camelizeKeys(followingQuery.rows)

    if (!isUserArray(following)) {
      throw new Error('Followers query invalid')
    }

    return following
  }
}

export default userQueries