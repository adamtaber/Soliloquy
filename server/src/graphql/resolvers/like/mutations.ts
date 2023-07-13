import { GraphQLError } from "graphql";
import { pool } from "../../../db/config";
import { MutationResolvers } from "../graphql-types";
import humps from 'humps'
import { isLike } from "./types";

const likeMutations: MutationResolvers = {
  likeContent: async (_root, args, {authorizedId}) => {
    const { postId, commentId } = args

    if(!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const createdOn = new Date()

    const query = 
      `INSERT INTO likes (user_id, post_id, comment_id, created_on)
       VALUES ($1, $2, $3, $4)
       RETURNING *`
    const values = [authorizedId, postId, commentId, createdOn]
    const likeMutation = await pool.query(query, values)
    const like = humps.camelizeKeys(likeMutation.rows[0])

    if(!isLike(like)) {
      throw new GraphQLError('Query response is not of type Like', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return true
  },
  deleteLike: async (_root, args, {authorizedId}) => {
    const { postId, commentId } = args

    if(!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const query = 
      `DELETE FROM likes
       WHERE (($2 = post_id) OR ($3 = comment_id)) 
         AND ($1 = user_id)`
    const values = [authorizedId, postId, commentId]
    await pool.query(query, values)

    return true
  }
}

export default likeMutations