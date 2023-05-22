import { GraphQLError } from "graphql";
import { QueryResolvers } from "../graphql-types";
import { pool } from "../../../db/config";
import humps from 'humps'
import { isBasicUserArray, isMessageArray } from "./types";

const messageQueries: QueryResolvers = {
  getMessages: async (_root, args, {authorizedId}) => {
    const {messagePartnerId} = args

    if(!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }
    
    const query =
      `SELECT u.displayname AS sender_name, m.content, m.message_id, m.created_on, m.receiver_id, m.sender_id
       FROM messages m
       JOIN users u
       ON m.sender_id = u.user_id
       WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY m.created_on DESC`

    const values = [authorizedId, messagePartnerId]
    const messageQuery = await pool.query(query, values)
    const messages = humps.camelizeKeys(messageQuery.rows)

    if(!isMessageArray(messages)) {
      throw new GraphQLError('Query response is not of type MessageArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    console.log(messages)

    return messages
  },
  getMessagePartners: async (_root, _args, {authorizedId}) => {
    if(!authorizedId) {
      throw new GraphQLError('User is not authorized', {
        extensions: {
          code: 'UNAUTHORIZED'
        }
      })
    }

    const query = 
      `SELECT DISTINCT ON 
         (username) 
         username, displayname, user_id, created_on, content AS recent_message
       FROM (
         SELECT 'out' AS type, 
           u.username, u.displayname, u.user_id, m.content, m.created_on
         FROM messages m
         JOIN users u
         ON m.receiver_id = u.user_id
         WHERE m.sender_id = $1
         UNION
         SELECT 'in' AS type, 
           u.username, u.displayname, u.user_id, m.content, m.created_on
         FROM messages m
         JOIN users u
         ON m.sender_id = u.user_id
         WHERE m.receiver_id = $1
       ) AS queryTable
       ORDER BY username, created_on DESC`

    const query2 = 
      `SELECT username, displayname, user_id, recent_message, created_on
       FROM (${query}) AS uniqueTable
       ORDER BY created_on DESC`

    const values = [authorizedId]
    const messagePartnerQuery = await pool.query(query2, values)
    const messagePartners = humps.camelizeKeys(messagePartnerQuery.rows)

    if(!isBasicUserArray(messagePartners)) {
      throw new GraphQLError('Query response is not of type BasicUserArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return messagePartners
  }
}

export default messageQueries