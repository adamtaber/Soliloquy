import { pool } from "../../../db/config"
import { QueryResolvers } from "../graphql-types"
import humps from 'humps'
import { isPostArray } from "./types"
import { isPost } from "./types"
import { GraphQLError } from "graphql"

const postQueries: QueryResolvers = {
  getPost: async(_root, args) => {
    const { postId } = args

    const query =
      `SELECT *
       FROM posts
       WHERE post_id = $1`
    const values = [postId]

    const postQuery = await pool.query(query, values)
    const post = humps.camelizeKeys(postQuery.rows[0])

    if(!isPost(post)) {
      throw new GraphQLError('Query response is not of type Post', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return post
  },
  getUserPosts: async(_root, args) => {
    const { userId } = args

    const query = 
      `SELECT *
       FROM posts
       WHERE user_id = $1
       ORDER BY created_on DESC`
    const values = [userId]

    const postsQuery = await pool.query(query, values)
    const posts = humps.camelizeKeys(postsQuery.rows)

    if (!isPostArray(posts)) {
      throw new GraphQLError('Query response is not of type PostArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return posts
  },
  getFeedPosts: async(_root, _args, { authorizedId }) => {
    if (!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const query1 = 
      `SELECT u.user_id
       FROM users u
       JOIN user_followers f
       ON u.user_id = f.user_id
       WHERE f.follower_id = $1`

    const query2 = 
      `SELECT p.post_id, p.user_id, p.content, p.created_on, u.displayname
       FROM posts p
       JOIN users u
       ON u.user_id = p.user_id
       WHERE p.user_id IN (${query1}) OR p.user_id = $1
       ORDER BY created_on DESC`
    
    const values = [authorizedId]

    const postsQuery = await pool.query(query2, values)
    const posts = humps.camelizeKeys(postsQuery.rows)

    if (!isPostArray(posts)) {
      throw new GraphQLError('Query response is not of type PostArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return posts
  }
}

export default postQueries