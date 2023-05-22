import { GraphQLError } from "graphql"
import { MutationResolvers } from "../graphql-types"
import { pool } from "../../../db/config"
import humps from "humps"
import { isMessage } from "./types"

const messageMutations: MutationResolvers = {
  createMessage: async (_root, args, {authorizedId}) => {
    const { receiverId, content}  = args

    if(!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const createdOn = new Date()

    const query = 
      `INSERT INTO messages (sender_id, receiver_id, content, created_on)
       VALUES ($1, $2, $3, $4)
       RETURNING *`
    const values = [authorizedId, receiverId, content, createdOn]
    const messageMutation = await pool.query(query, values)
    const message = humps.camelizeKeys(messageMutation.rows[0])

    if(!isMessage(message)) {
      throw new GraphQLError('Query response is not of type Message', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return message
  },
  deleteMessage: async (_root, args, {authorizedId}) => {
    const { messageId } = args

    if(!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const query = 
      `DELETE FROM messages
       WHERE message_id = $1`
    const values = [messageId]
    await pool.query(query, values)

    return true
  }
}

export default messageMutations