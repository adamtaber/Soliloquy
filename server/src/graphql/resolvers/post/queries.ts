import { pool } from "../../../db/config"
import { QueryResolvers } from "../graphql-types"
import humps from 'humps'
import { isPostArray } from "./types"
import { isPost } from "./types"
import { GraphQLError } from "graphql"

const postQueries: QueryResolvers = {
  getPost: async(_root, args, {authorizedId}) => {
    const { postId } = args

    const likesCount = 
      `SELECT COUNT(*)
       FROM likes l
       WHERE l.post_id = p.post_id`

    const likedByCurrentUser = 
      `SELECT user_id
       FROM likes l
       WHERE (l.post_id = p.post_id) AND (l.user_id = $2)`

    const query =
      `SELECT p.*, (${likesCount}) AS likes_count,
       (${likedByCurrentUser}) AS current_user_like
       FROM posts p
       WHERE post_id = $1`
    const values = [postId, authorizedId]

    const query2 = 
      `SELECT u.*
       FROM posts p
       JOIN users u
         ON p.user_id = u.user_id
       WHERE p.post_id = $1`
    const values2 = [postId]
    

    const postQuery = await pool.query(query, values)
    const post = humps.camelizeKeys(postQuery.rows[0])

    const userQuery = await pool.query(query2, values2)
    const user = humps.camelizeKeys(userQuery.rows[0])

    const totalPost = {...post, poster: {...user}}

    if(!isPost(totalPost)) {
      throw new GraphQLError('Query response is not of type Post', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return totalPost
  },
  getUserPosts: async(_root, args) => {
    const { userId } = args

    const likesCount = 
      `SELECT COUNT(*)
       FROM likes l
       WHERE l.post_id = p.post_id`

    const likedByCurrentUser = 
      `SELECT user_id
       FROM likes l
       WHERE (l.post_id = p.post_id) AND (l.user_id = $1)`

    const query = 
      `SELECT p.*, (${likesCount}) AS likes_count, 
       (${likedByCurrentUser}) AS current_user_like
       FROM posts p
       WHERE user_id = $1
       ORDER BY created_on DESC`
    const values = [userId]

    const query2 = 
      `SELECT *
       FROM users
       WHERE user_id = $1`


    const postsQuery = await pool.query(query, values)
    const posts = humps.camelizeKeys(postsQuery.rows)

    const userQuery = await pool.query(query2, values)
    const user = humps.camelizeKeys(userQuery.rows[0])

    if (!Array.isArray(posts)) {
      throw new GraphQLError('Query response is not of type Array', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    const totalPosts = posts.map((post) => {
      return {...post, poster: {...user}}
    })

    if (!isPostArray(totalPosts)) {
      throw new GraphQLError('Query response is not of type PostArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return totalPosts
  },
  getFeedPosts: async(_root, args, { authorizedId }) => {
    const {lastPostId, lastCreatedOn, limit} = args
    if (!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const followedUsers = 
      `SELECT u.user_id
       FROM users u
       JOIN user_followers f
         ON u.user_id = f.user_id
       WHERE f.follower_id = $1`

    const likesCount = 
      `SELECT COUNT(*)
       FROM likes l
       WHERE l.post_id = p.post_id`

    const likedByCurrentUser = 
      `SELECT user_id
       FROM likes l
       WHERE (l.post_id = p.post_id) AND (l.user_id = $1)`

    const initialQuery = 
      `SELECT 
         *, 
         p.created_on AS post_created_on, 
         u.created_on AS user_created_on, 
         (${likesCount}) AS likes_count,
         (${likedByCurrentUser}) AS current_user_like
       FROM posts p
       JOIN users u
         ON u.user_id = p.user_id
       WHERE (p.user_id IN (${followedUsers}) OR p.user_id = $1)
       ORDER BY p.created_on DESC, p.post_id DESC
       LIMIT $2`
    
    const nextQuery = 
      `SELECT 
         *, 
         p.created_on AS post_created_on,
         u.created_on AS user_created_on,
         (${likesCount}) AS likes_count,
         (${likedByCurrentUser}) AS current_user_like
       FROM posts p
       JOIN users u
         ON u.user_id = p.user_id
       WHERE (p.user_id IN (${followedUsers}) OR p.user_id = $1)
         AND (p.created_on, p.post_id) < ($2, $3)
       ORDER BY p.created_on DESC, p.post_id DESC
       LIMIT $4`

    const values = lastPostId && lastCreatedOn 
      ? [authorizedId, lastCreatedOn, lastPostId, limit]
      : [authorizedId, limit]

    const postsQuery = lastPostId && lastCreatedOn 
      ? await pool.query(nextQuery, values)
      : await pool.query(initialQuery, values)
    const posts = humps.camelizeKeys(postsQuery.rows)

    if (!Array.isArray(posts)) {
      throw new GraphQLError('Query response is not of type Array', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    const totalPosts = posts.map((post) => {
      return {
        postId: post.postId,
        content: post.content,
        createdOn: post.postCreatedOn,
        likesCount: post.likesCount,
        currentUserLike: post.currentUserLike,
        poster: {
          userId: post.userId,
          displayname: post.displayname,
          username: post.username,
          email: post.email,
          password: post.password
        }
      }
    })

    if (!isPostArray(totalPosts)) {
      throw new GraphQLError('Query response is not of type PostArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return totalPosts
  }
}

export default postQueries