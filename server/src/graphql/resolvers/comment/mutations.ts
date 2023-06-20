import { pool } from "../../../db/config"
import { MutationResolvers } from "../graphql-types"
import humps from 'humps'
import { isComment } from "./types"
import { GraphQLError } from "graphql"

const commentMutations: MutationResolvers = {
  createComment: async (_root, args, {authorizedId }) => {
    const { postId, parentCommentId, content } = args

    if (!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const createdOn = new Date()

    const query = 
      `INSERT INTO comments 
        (user_id, post_id, content, created_on, parent_comment_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`
    const values = [authorizedId, postId, content, createdOn, parentCommentId]

    const query2 =
      `SELECT *
       FROM users
       WHERE user_id = $1`
    const values2 = [authorizedId]

    const commentMutation = await pool.query(query, values)
    const comment = humps.camelizeKeys(commentMutation.rows[0])

    const userQuery = await pool.query(query2, values2)
    const user = humps.camelizeKeys(userQuery.rows[0])

    const newComment = {
      ...comment,
      likesCount: 0,
      currentUserLike: null,
      user: {
        ...user
      },
      comments: []
    }

    if(!isComment(newComment)) {
      throw new GraphQLError('Query response is not of type Comment', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return newComment
  },
  deleteComment: async (_root, args, { authorizedId }) => {
    const { commentId } = args

    if (!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
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