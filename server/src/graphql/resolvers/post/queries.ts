import { pool } from "../../../db/config"
import { QueryResolvers } from "../graphql-types"
import humps from 'humps'
import { isPostArray } from "./types"
import { isPost } from "./types"

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
      throw new Error('value is not a post')
    }

    return post
  },
  getUserPosts: async(_root, args) => {
    const { userId } = args

    const query = 
      `SELECT *
       FROM posts
       WHERE user_id = $1`
    const values = [userId]

    const postsQuery = await pool.query(query, values)
    const posts = humps.camelizeKeys(postsQuery.rows)

    if (!isPostArray(posts)) {
      throw new Error('value not array of posts')
    }

    return posts
  },
  getFeedPosts: async(_root, _args, { authorizedId }) => {
    if (!authorizedId) {
      throw new Error('user not authorized')
    }

    const query1 = 
      `SELECT u.user_id
       FROM users u
       JOIN user_followers f
       ON u.user_id = f.user_id
       WHERE f.follower_id = $1`

    const query2 = 
      `SELECT *
       FROM posts
       WHERE user_id IN (${query1}) OR user_id = $1`
    
    const values = [authorizedId]

    const postsQuery = await pool.query(query2, values)
    const posts = humps.camelizeKeys(postsQuery.rows)

    if (!isPostArray(posts)) {
      throw new Error('value not array of posts')
    }

    return posts
  }
}

export default postQueries