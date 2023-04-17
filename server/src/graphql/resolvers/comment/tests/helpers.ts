import { pool } from "../../../../db/config"

import { getFirstPostId } from "../../post/tests/helper"

export const commentArray = [
  {"content": "comment 1"},
  {"content": "comment 2"},
  {"content": "comment 3"},
] 

export const seedComments = async (userId: String) => {
  const postId = await getFirstPostId(userId)

  const query = 
  `INSERT INTO comments 
    (user_id, post_id, content, created_on, parent_comment_id)
    VALUES ($1, $2, $3, $4, $5)`
  
  const values1 = [userId, postId, commentArray[0].content, new Date(), null]
  const values2 = [userId, postId, commentArray[1].content, new Date(), null]
  const values3 = [userId, postId, commentArray[2].content, new Date(), null]

  await pool.query(query, values1)
  await pool.query(query, values2)
  await pool.query(query, values3)
}

export const getFirstCommentId = async (userId: String) => {
  const query = 
    `SELECT comment_id FROM comments WHERE user_id = $1`
  const values = [userId]
  const id = await pool.query(query, values)
  return id.rows[0].comment_id
}