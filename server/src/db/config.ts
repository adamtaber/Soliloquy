import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '../config'
import { Pool } from 'pg'

export const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
})

export const connectToDB = async () => {
  try {
    await pool.connect()
  } catch (err) {
    console.log(err)
  }
}


