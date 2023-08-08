import { faker } from "@faker-js/faker"
import * as argon2 from 'argon2'
import { pool } from "./config"
import humps from 'humps'

const checkForUsers = async () => {
  const query = `
    SELECT *
    FROM users
  `
  const checkQuery = await pool.query(query)
  const check = checkQuery.rows

  return check.length
}

const checkForFollowers = async () => {
  const query = `
    SELECT *
    FROM user_followers
  `
  const checkQuery = await pool.query(query)
  const check = checkQuery.rows

  return check.length
}

const checkForPosts = async () => {
  const query = `
    SELECT *
    FROM posts
  `
  const checkQuery = await pool.query(query)
  const check = checkQuery.rows

  return check.length
}


const seedUsers = async (quantity: number) => {
  const users = []

  for (let i = 0; i < quantity; i++) {
    const displayname = `${faker.name.firstName()} ${faker.name.lastName()}`
    const username = `${faker.word.adjective({ length: { min: 3, max: 12 }})}${faker.word.noun({ length: { min: 3, max: 13 }})}`
    const email = faker.internet.email()
    const password = 'password'
    const hash = await argon2.hash(password)
    const createdOn = new Date()

    const query = 
    `INSERT INTO users (displayname, username, 
        email, password, created_on) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`
    const values = [displayname, username, email, hash, createdOn]
    const userMutation = await pool.query(query, values)

    const user = humps.camelizeKeys(userMutation.rows[0])

    users.push(user)
  }
}

const seedFollowers = async () => {
  const query = 
    `SELECT user_id
      FROM users`
  const userQuery = await pool.query(query)
  const users = humps.camelizeKeys(userQuery.rows)

  if(!Array.isArray(users)) {
    console.log('follower seed not an array')
    return
  }

  const quantity = users.length

  for (let i = 0; i < quantity; i++) {
    const userId = users[i].userId
    users.forEach(async user => {
      if(userId !== user.userId) {
        const followQuery = 
        `INSERT INTO user_followers (user_id, follower_id)
        VALUES ($1, $2)`
        const values2 = [user.userId, userId]
        await pool.query(followQuery, values2)
      }
    })
  }
}

const seedPosts = async () => {
  const query = 
    `SELECT user_id
      FROM users`
  const userQuery = await pool.query(query)
  const users = humps.camelizeKeys(userQuery.rows)

  if(!Array.isArray(users)) {
    console.log('user array not an array')
    return
  }

  users.forEach(async (user) => {
    const content = faker.lorem.sentence()
    const createdOn = new Date()

    const query =
    `INSERT INTO posts (user_id, content, created_on)
      VALUES ($1, $2, $3)
      RETURNING *`
    const values = [user.userId, content, createdOn]
    await pool.query(query, values)
  })

  return true
}

export const seedContent = async () => {
  const usersLength = await checkForUsers()
  if (!usersLength) await seedUsers(50)
  const followersLength = await checkForFollowers()
  if (!followersLength) await seedFollowers()
  const postsLength = await checkForPosts()
  if (!postsLength) await seedPosts()
}