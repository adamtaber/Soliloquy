import { pool } from "../../../../db/config"
import { createTestServer } from "../../../../utils"
import { getUserId, seedNames, seedUsers } from "../../user/tests/helper"
import { countUserPosts, getFirstPostId, seedPosts } from './helper'
import { CREATE_POST, DELETE_POST } from './requests'
import assert from 'assert'

describe('Post Mutations', () => {
  const testServer = createTestServer()

  beforeEach(async () => {
    await pool.query('DELETE FROM users')
    await seedUsers()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('creates a post', async () => {
    const post = {
      content: 'this is a test post',
    }

    const id = await getUserId(seedNames[0])

    const postQuery = await pool.query('SELECT * FROM posts')
    const posts = postQuery.rows

    const response = await testServer.executeOperation(
      {
        query: CREATE_POST,
        variables: post
      },
      {
        contextValue: {
          authorizedId: id
        }
      }
    )
    
    assert(response.body.kind === 'single')

    const newPostQuery = await pool.query('SELECT * FROM posts')
    const newPosts = newPostQuery.rows

    expect(newPosts.length).toEqual(posts.length + 1)
  })

  it('deletes a post', async () => {
    const id = await getUserId(seedNames[0])

    await seedPosts(id)

    const initialPosts = await countUserPosts(id)

    const postId = await getFirstPostId(id)

    await testServer.executeOperation(
      {
        query: DELETE_POST,
        variables: {postId}
      },
      {
        contextValue: {
          authorizedId: id
        }
      }
    )

    const finalPosts = await countUserPosts(id)

    expect(finalPosts).toEqual(initialPosts - 1)
  })
})