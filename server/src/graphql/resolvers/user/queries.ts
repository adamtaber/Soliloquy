import { pool } from "../../../db/config"
import { QueryResolvers } from "../../../resolvers-types"
import humps from 'humps'
import { isUser, isUserArray } from "./types"

const userQueries: QueryResolvers = {
  allUsers: async () => {
    const usersQuery = await pool.query('SELECT * FROM users')
    const users = humps.camelizeKeys(usersQuery.rows)
    
    if(!isUserArray(users)) {
      throw new Error('Users query invalid')
    }

    return users
  },
  findUser: async (_root, args) => {
    const { userId } = args
    const query = 'SELECT * FROM users WHERE user_id = $1'
    const values = [userId]

    const userQuery = await pool.query(query, values)
    const user = humps.camelizeKeys(userQuery.rows[0])

    if(!isUser(user)) {
      throw new Error('User query invalid')
    }

    return user
  }
}

export default userQueries