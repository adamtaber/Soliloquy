import { pool } from "../../../db/config"
import humps from 'humps'
import { isUser, isUserArray } from "./types"
import { QueryResolvers } from "../graphql-types"
import { GraphQLError } from "graphql"

const userQueries: QueryResolvers = {
  allUsers: async () => {
    const usersQuery = await pool.query('SELECT * FROM users')
    const users = humps.camelizeKeys(usersQuery.rows)
    
    if(!isUserArray(users)) {
      throw new GraphQLError('Query response is not of type UserArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return users
  },
  currentUser: async (_root, _args, { authorizedId }) => {
    if(!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const query = 'SELECT * FROM users WHERE user_id = $1'
    const values = [authorizedId]

    const userQuery = await pool.query(query, values)
    const user = humps.camelizeKeys(userQuery.rows[0])

    if(!isUser(user)) {
      throw new GraphQLError('Query response is not of type User', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
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
      throw new GraphQLError('Query response is not of type User', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return user
  },
  searchUsers: async (_root, args) => {
    const { searchInput } = args

    const alteredInput = `%${searchInput}%`

    const query = 
      `SELECT *
       FROM users
       WHERE username ILIKE $1 OR displayname ILIKE $1`
    const values = [alteredInput]

    const searchQuery = await pool.query(query, values)
    const searchRes = humps.camelizeKeys(searchQuery.rows)

    if (!isUserArray(searchRes)) {
      throw new GraphQLError('Query response is not of type UserArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return searchRes
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
      throw new GraphQLError('Query response is not of type UserArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return followers
  },
  getFollowerCount: async (_root, args) => {
    const { userId } = args

    const query = 
      `SELECT COUNT(follower_id)
       FROM user_followers
       WHERE user_id = $1`
    const values = [userId]
    
    const followerQuery = await pool.query(query, values)
    let followerCount = humps.camelizeKeys(followerQuery.rows[0]).count
    followerCount = Number(followerCount)

    if (typeof followerCount === 'number' && !Number.isNaN(followerCount)) {
      return followerCount
    } else {
      throw new GraphQLError('Query response is not of type Number', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }
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
      throw new GraphQLError('Query response is not of type UserArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return following
  },
  getFollowingCount: async (_root, args) => {
    const { userId } = args

    const query = 
      `SELECT COUNT(user_id)
       FROM user_followers
       WHERE follower_id = $1`
    const values = [userId]
    
    const followingQuery = await pool.query(query, values)
    let followingCount = humps.camelizeKeys(followingQuery.rows[0]).count
    followingCount = Number(followingCount)

    if (typeof followingCount === 'number' && !Number.isNaN(followingCount)) {
      return followingCount
    } else {
      throw new GraphQLError('Query response is not of type Number', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }
  }
}

export default userQueries