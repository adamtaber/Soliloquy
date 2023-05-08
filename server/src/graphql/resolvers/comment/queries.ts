import { pool } from "../../../db/config"
import { QueryResolvers } from "../graphql-types"
import humps from 'humps'
import { isCommentArray } from "./types"
import { GraphQLError } from "graphql"

const commentQueries: QueryResolvers = {
  getComments: async (_root, args) => {
    const { postId } = args

    const query = 
      `SELECT * FROM comments
       WHERE post_id = $1 AND parent_comment_id IS NULL`
    const values = [postId]
    const commentQuery = await pool.query(query, values)
    const comments = humps.camelizeKeys(commentQuery.rows)

    if(!isCommentArray(comments)) {
      throw new GraphQLError('Query response is not of type CommentArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return comments
  },
  getChildComments: async (_root, args) => {
    const { postId, parentCommentId } = args

    const query = 
      `SELECT * FROM comments
      WHERE post_id = $1 AND parent_comment_id = $2`
    const values = [postId, parentCommentId]
    const commentQuery = await pool.query(query, values)
    const comments = humps.camelizeKeys(commentQuery.rows)

  if(!isCommentArray(comments)) {
    throw new GraphQLError('Query response is not of type CommentArray', {
      extensions: {
        code: 'INVALID_TYPE'
      }
    })
  }

  return comments
  }
}

export default commentQueries