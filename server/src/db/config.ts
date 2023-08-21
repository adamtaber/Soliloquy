// import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '../config'
import { Pool } from 'pg'
import { DATABASE_URL } from '../config'

// export const pool = new Pool({
//   host: DB_HOST,
//   user: DB_USER,
//   database: DB_DATABASE,
//   password: DB_PASSWORD,
//   port: DB_PORT,
//   max: process.env.NODE_ENV === 'test' ? 1 : 10
// })

export const pool = new Pool({
  connectionString: DATABASE_URL
})


