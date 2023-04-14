import assert from "assert"
import { pool } from "../../../../db/config"
import { createTestServer } from "../../../../utils"
import { getUserId, seedNames, seedUsers } from "../../user/tests/helper"
import { seedPosts, userPosts } from "./helper"
import { GET_USER_POSTS } from "./requests"

describe('Post Queries', () => {
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

  it('gets all user posts', async () => {
    const id = await getUserId(seedNames[0])

    const response = await testServer.executeOperation(
      {
        query: GET_USER_POSTS,
        variables: {userId: id} 
      }
    )

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.getUserPosts).toEqual(userPosts)
  })
})