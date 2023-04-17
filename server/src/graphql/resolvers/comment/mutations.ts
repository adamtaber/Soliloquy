import { pool } from "../../../db/config"
import { MutationResolvers } from "../graphql-types"
import humps from 'humps'
import { isComment } from "./types"

const commentMutations: MutationResolvers = {
  createComment: async (_root, args, {authorizedId }) => {
    const { postId, parentCommentId, content } = args

    if (!authorizedId) {
      throw new Error('user not authorized')
    }

    if (!postId) {
      throw new Error('missing args')
    }

    const createdOn = new Date()

    const query = 
      `INSERT INTO comments 
        (user_id, post_id, content, created_on, parent_comment_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`
    const values = [authorizedId, postId, content, createdOn, parentCommentId]
    const commentMutation = await pool.query(query, values)
    const comment = humps.camelizeKeys(commentMutation.rows[0])

    if(!isComment(comment)) {
      throw new Error('return value not of type comment')
    }

    return comment
  },
  deleteComment: async (_root, args, { authorizedId }) => {
    const { commentId } = args

    if (!authorizedId) {
      throw new Error('user not authorized')
    }

    const query = 
      `DELETE FROM comments
       WHERE comment_id = $1`
    const values = [commentId]
    await pool.query(query, values)

    return true
  }
}

export default commentMutations