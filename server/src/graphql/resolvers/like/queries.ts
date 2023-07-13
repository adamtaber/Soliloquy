import { GraphQLError } from "graphql"
import { QueryResolvers } from "../graphql-types"
import { isLikeArray } from "./types"
import humps from 'humps'
import { pool } from "../../../db/config"

const likeQueries: QueryResolvers = {
  getLikes: async (_root, _args, {authorizedId}) => {
    if(!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const query = 
      `SELECT *
       FROM likes`
    
    const likeQuery = await pool.query(query)
    const likes = humps.camelizeKeys(likeQuery.rows)

    if(!isLikeArray(likes)){
      throw new GraphQLError('Query response is not of type LikeArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return likes
  }
}

export default likeQueries