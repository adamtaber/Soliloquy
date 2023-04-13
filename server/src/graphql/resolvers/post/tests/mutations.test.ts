import { pool } from "../../../../db/config"
import { createTestServer } from "../../../../utils"
import { getUserId, seedNames, seedUsers } from "../../user/tests/helper"
import { CREATE_POST } from './requests'
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
})