import { pool } from "../../../db/config"
import humps from 'humps'
import { isPost } from "./types"
import { MutationResolvers } from "../graphql-types"

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

    if(!isPost(post)) {
      throw new Error('Returned value is not of type "Post"')
    }
    return post
  },
  deletePost: async(_root, args, { authorizedId }) => {
    const { postId } = args

    if (!authorizedId) {
      throw new Error('User is not authorized')
    }

    const query = 
      `DELETE FROM posts
       WHERE post_id = $1`
    const values = [postId]
    await pool.query(query, values)

    return true
  }
}

export default postMutations