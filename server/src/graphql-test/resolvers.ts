// import { pool } from '../db/config'
// import * as argon2 from 'argon2'
// import { userObject } from '../types'
import { Resolvers } from '../resolver-types'

export const resolvers: Resolvers = {
  // Query: {
  //   allUsers: () => pool.query('SELECT * FROM users', (error, results) => {
  //     if (error) {
  //       throw error
  //     }
  //     console.log(results)
  //     const result: userObject = {displayname: "john", username: "john", email: "john", password: "john", user_id: 1, created_on: "string"}
  //     return result
  //   })
  // },
  // Mutation: {
  //   createUser: async (root, args) => {
  //     const { displayname, username, email, password } = args
  //     const hash = await argon2.hash(password)
  //     pool.query('INSERT INTO users (displayname, username, email, password) VALUES ($1, $2, $3, $5)', 
  //       [displayname, username, email, hash], (err, result) => {
  //         if (err) {
  //           return console.error('Mutation failed', err.stack)
  //         }
  //         console.log(result)
  //       })
  //   }
  // }
}
