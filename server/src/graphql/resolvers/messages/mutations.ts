import { GraphQLError } from "graphql"
import { MutationResolvers } from "../graphql-types"
import { pool } from "../../../db/config"
import humps from "humps"
import { isMessage } from "./types"
import { pubsub } from "../../../utils"

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
    let message = humps.camelizeKeys(messageMutation.rows[0])

    const query2 = 
      `SELECT displayname
       FROM users
       WHERE user_id = $1`
    const values2 = [authorizedId]
    const sendNameQuery = await pool.query(query2, values2)
    const senderName = humps.camelizeKeys(sendNameQuery.rows[0])

    message = {...message, senderName: senderName.displayname}

    if(!isMessage(message)) {
      throw new GraphQLError('Query response is not of type Message', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    pubsub.publish('MESSAGE_SENT', { messageSent: message })

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

    const values = [messageId]

    const findQuery = 
      `SELECT u.displayname AS sender_name, m.content, m.message_id, m.created_on, m.receiver_id, m.sender_id
       FROM messages m
       JOIN users u
       ON m.sender_id = u.user_id
       WHERE message_id = $1`

    const findMessage = await pool.query(findQuery, values)
    const message = humps.camelizeKeys(findMessage.rows[0])

    const query = 
      `DELETE FROM messages
       WHERE message_id = $1`
    
    await pool.query(query, values)

    pubsub.publish('MESSAGE_DELETED', { messageDeleted: message})

    return true
  }
}

export default messageMutations