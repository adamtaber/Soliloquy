import assert from "assert"
import { pool } from "../../../../db/config"
import { createTestServer } from "../../../../utils"
import { getFirstPostId, seedPosts } from "../../post/tests/helper"
import { getUserId, seedNames, seedUsers } from "../../user/tests/helper"
import { commentArray, seedComments } from "./helpers"
import { GET_COMMENTS } from "./requests"

describe('Comment Queries', () => {
  const testServer = createTestServer()

  beforeEach(async () => {
    await pool.query('DELETE FROM users')
    await seedUsers()
    const id = await getUserId(seedNames[0])
    await seedPosts(id)
    await seedComments(id)
  })

  afterAll(async () => {
    await pool.end()
  })

  it("get's all of a post's comments", async () => {
    const userId = await getUserId(seedNames[0])
    const postId = await getFirstPostId(userId)

    const results = await testServer.executeOperation({
      query: GET_COMMENTS,
      variables: {postId}
    })

    assert(results.body.kind === 'single')
    expect(results.body.singleResult.data?.getComments).toEqual(commentArray)
  })
})