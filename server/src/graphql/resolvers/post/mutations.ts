import { pool } from "../../../db/config"
import humps from 'humps'
import { isPost } from "./types"
import { MutationResolvers } from "../graphql-types"
import { faker } from "@faker-js/faker"
import { GraphQLError } from "graphql"

const postMutations: MutationResolvers = {
  createPost: async(_root, args, { authorizedId }) => {
    const { content } = args
    const createdOn = new Date()
  
    const query =
      `INSERT INTO posts (user_id, content, created_on)
       VALUES ($1, $2, $3)
       RETURNING *`
    const values = [authorizedId, content, createdOn]
    const postMutation = await pool.query(query, values)
    const post = humps.camelizeKeys(postMutation.rows[0])

    const newPost = {
      ...post,
      likesCount: 0,
      currentUserLike: false
    }

    console.log(newPost)

    if(!isPost(newPost)) {
      throw new GraphQLError('Query response is not of type Post', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }
    return newPost
  },
  deletePost: async(_root, args, { authorizedId }) => {
    const { postId } = args

    if (!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const query = 
      `DELETE FROM posts
       WHERE post_id = $1`
    const values = [postId]
    await pool.query(query, values)

    return true
  },
  generatePosts: async() => {
    const query = 
      `SELECT user_id
       FROM users`
    const userQuery = await pool.query(query)
    const users = humps.camelizeKeys(userQuery.rows)

    if(!Array.isArray(users)) {
      throw new GraphQLError('Query response is not of type Array', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    users.forEach(async (user) => {
      const content = faker.lorem.sentence()
      const createdOn = new Date()

      const query =
      `INSERT INTO posts (user_id, content, created_on)
       VALUES ($1, $2, $3)
       RETURNING *`
      const values = [user.userId, content, createdOn]
      await pool.query(query, values)
    })

    return true
  }
}

export default postMutations