import { pool } from "../../../db/config"
import { QueryResolvers } from "../graphql-types"
import humps from 'humps'
import { isCommentArray } from "./types"

const commentQueries: QueryResolvers = {
  getComments: async (_root, args) => {
    const { postId } = args

    // const parentType = postId ? 'post_id' : 'parent_comment_id'
    // const parentId = postId || parentCommentId

    const query = 
      `SELECT * FROM comments
       WHERE post_id = $1`
    const values = [postId]
    const commentQuery = await pool.query(query, values)
    const comments = humps.camelizeKeys(commentQuery.rows)

    if(!isCommentArray(comments)) {
      throw new Error('return value not comment array')
    }

    return comments
  }
}

export default commentQueries