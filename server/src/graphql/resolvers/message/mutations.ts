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
      `SELECT displayname, username, user_id, password, created_on, email
       FROM users
       WHERE user_id = $1`
    const values2 = [authorizedId]
    const senderQuery = await pool.query(query2, values2)
    const sender = humps.camelizeKeys(senderQuery.rows[0])

    const query3 = 
     `SELECT displayname, username, user_id, password, created_on, email
      FROM users
      WHERE user_id = $1`
    const values3 = [receiverId]
    const receiverQuery = await pool.query(query3, values3)
    const receiver = humps.camelizeKeys(receiverQuery.rows[0])

    message = {...message, sender: {...sender}, receiver: {...receiver}}

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
      `SELECT m.message_id, m.content, m.created_on, 
         r.user_id AS r_user_id, r.displayname AS r_displayname, r.username AS r_username,
         r.password AS r_password, r.email AS r_email, r.created_on AS r_created_on,
         s.user_id AS s_user_id, s.displayname AS s_displayname, s.username AS s_username,
         s.password AS s_password, s.email AS s_email, s.created_on AS s_created_on
       FROM messages m
       JOIN users r
       ON m.receiver_id = r.user_id
       JOIN users s
       ON m.sender_id = s.user_id
       WHERE message_id = $1`

    // const findQuery = 
    //   `SELECT m.content, m.message_id, m.created_on, m.receiver_id, m.sender_id
    //    FROM messages m
    //    JOIN users u
    //    ON m.sender_id = u.user_id
    //    WHERE message_id = $1`

    const findMessage = await pool.query(findQuery, values)
    const message = humps.camelizeKeys(findMessage.rows[0])

    const newMessage = {
        messageId: message.messageId,
        content: message.content,
        createdOn: message.createdOn,
        receiver: {
          userId: message.rUserId,
          displayname: message.rDisplayname,
          username: message.rUsername,
          password: message.rPassword,
          email: message.rEmail,
          createdOn: message.rCreatedOn
        },
        sender: {
          userId: message.sUserId,
          displayname: message.sDisplayname,
          username: message.sUsername,
          password: message.sPassword,
          email: message.sEmail,
          createdOn: message.sCreatedOn
        }
      }

    const query = 
      `DELETE FROM messages
       WHERE message_id = $1`
    
    await pool.query(query, values)

    pubsub.publish('MESSAGE_DELETED', { messageDeleted: newMessage})

    return true
  }
}

export default messageMutations