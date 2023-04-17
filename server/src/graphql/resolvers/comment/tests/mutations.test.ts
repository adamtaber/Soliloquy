import { pool } from "../../../../db/config"
import { createTestServer } from "../../../../utils"
import { getFirstPostId, seedPosts } from "../../post/tests/helper"
import { getUserId, seedNames, seedUsers } from "../../user/tests/helper"
import { CREATE_COMMENT, DELETE_COMMENT } from './requests'
import { getFirstCommentId, seedComments } from './helpers'

describe('Comment Mutations', () => {
  const testServer = createTestServer()

  beforeEach(async () => {
    await pool.query('DELETE FROM users')
    await seedUsers()
    const id = await getUserId(seedNames[0])
    await seedPosts(id)
  })

  afterAll(async () => {
    await pool.end()
  })

  it('Creates a comment on a post', async () => {
    const userId = await getUserId(seedNames[0])
    const postId = await getFirstPostId(userId)

    const comment = {
      content: "this is a comment",
      postId: postId
    }

    const commentQuery = 
      await pool.query(`SELECT * FROM comments WHERE post_id = $1`, [postId])
    const initialComments = commentQuery.rows

    await testServer.executeOperation(
      {
        query: CREATE_COMMENT,
        variables: comment
      },
      {
        contextValue: {
          authorizedId: userId
        }
      }
    )

    const newCommentQuery = 
      await pool.query(`SELECT * FROM comments WHERE post_id = $1`, [postId])
    const newComments = newCommentQuery.rows

    expect(newComments.length).toEqual(initialComments.length + 1)
  })

  it('Deletes a comment', async () => {
    const userId = await getUserId(seedNames[0])
    await seedComments(userId)
    const commentId = await getFirstCommentId(userId)

    const commentQuery = 
      await pool.query('SELECT * FROM comments WHERE user_id = $1', [userId])
    const initialComments = commentQuery.rows

    await testServer.executeOperation(
      {
        query: DELETE_COMMENT,
        variables: { commentId }
      },
      {
        contextValue: {
          authorizedId: userId
        }
      }
    )

    const newCommentQuery =
      await pool.query('SELECT * FROM comments WHERE user_id = $1', [userId])
    const newComments = newCommentQuery.rows

    expect(newComments.length).toEqual(initialComments.length - 1)
  })
})