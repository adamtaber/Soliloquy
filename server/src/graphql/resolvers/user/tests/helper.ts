import { pool } from "../../../../db/config"

export const seedUsers = async () => {
  const user1 = {
    displayname: 'test1',
    username: 'test1',
    password: 'test',
    email: 'test1@test',
    created_on: new Date() 
  }
  
  const user2 = {
    displayname: 'test2',
    username: 'test2',
    password: 'test',
    email: 'test2@test',
    created_on: new Date() 
  }
  
  const user3 = {
    displayname: 'test3',
    username: 'test3',
    password: 'test',
    email: 'test3@test',
    created_on: new Date() 
  }

  const query = 
    `INSERT INTO users (displayname, username, password, email, created_on)
     VALUES ($1, $2, $3, $4, $5)`
  const values1 = 
    [user1.displayname, user1.username, user1.password, user1.email, user1.created_on]
  const values2 = 
    [user2.displayname, user2.username, user2.password, user2.email, user2.created_on]
  const values3 = 
    [user3.displayname, user3.username, user3.password, user3.email, user3.created_on]

  await pool.query(query, values1)
  await pool.query(query, values2)
  await pool.query(query, values3)
}

export const seedNames = ['test1', 'test2', 'test3']

export const getUserId = async (username: string) => {
  const query = "SELECT user_id FROM users WHERE username = $1"
  const values = [username]
  const userIdQuery = await pool.query(query, values)
  const userId = userIdQuery.rows[0].user_id
  return userId
}