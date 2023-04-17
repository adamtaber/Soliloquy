import { pool } from "../../../../db/config"

export const seedPosts = async (userId: String) => {
  const query = 
    `INSERT INTO posts (user_id, content, created_on)
     VALUES ($1, $2, $3)`
  const values1 = [userId, 'test post 1', new Date()]
  const values2 = [userId, 'test post 2', new Date()]
  const values3 = [userId, 'test post 3', new Date()]

  await pool.query(query, values1)
  await pool.query(query, values2)
  await pool.query(query, values3)
}

export const seedFollowPosts = async (userId: String) => {
  const query =
    `INSERT INTO posts (user_id, content, created_on)
     VALUES ($1, $2, $3)`
  const values = [userId, 'followed post', new Date()]
  await pool.query(query, values)
}

export const followUser = async (userId: String, followedId: String) => {
  const query = 
    `INSERT INTO user_followers (user_id, follower_id)
     VALUES ($1, $2)`
  const values = [followedId, userId]
  await pool.query(query, values)
}

const postQuery = async (userId: String) => {
  const query = 
    `SELECT * FROM posts WHERE user_id = $1`
  const values = [userId]

  const postsQuery = await pool.query(query, values)
  const posts = postsQuery.rows

  return posts
}

export const countUserPosts = async (userId: String) => {
  const posts = await postQuery(userId)

  return posts.length
}

export const getFirstPostId = async (userId: String) => {
  const posts = await postQuery(userId)

  return posts[0].post_id
}

export const userPosts = [{"content": "test post 1"}, {"content": "test post 2"}, {"content": "test post 3"}]
export const feedPosts = [...userPosts, {"content": "followed post"}]