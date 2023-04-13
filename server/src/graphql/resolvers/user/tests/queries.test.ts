import assert from "assert"
import { GET_FOLLOWERS, GET_FOLLOWING, GET_USER, GET_USERS } from './requests'
import { pool } from "../../../../db/config"
import { createTestServer } from "../../../../utils"
import { getUserId, seedNames, seedUsers } from "./helper"

describe('User Queries', () => {
  const testServer = createTestServer()

  beforeEach(async () => {
    await pool.query('DELETE FROM users')
    await seedUsers()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('returns all users', async () => {
    const response = await testServer.executeOperation({
      query: GET_USERS
    })  

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.allUsers)
      .toEqual([{"username": seedNames[0]}, {"username": seedNames[1]}, {"username": seedNames[2]}])
  })

  it('finds a specific user', async () => {
    const userId = await getUserId(seedNames[0])
    const response = await testServer.executeOperation({
      query: GET_USER,
      variables: { userId }
    })

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.findUser).toEqual({username: seedNames[0]})
  })

  it('returns the followers of a user', async () => {
    const userId1 = await getUserId(seedNames[0])
    const userId2 = await getUserId(seedNames[1])
    const userId3 = await getUserId(seedNames[2])

    const query = 
      `INSERT INTO user_followers (user_id, follower_id)
       VALUES ($1, $2)`
    const values = [userId1, userId2]
    const values2 = [userId1, userId3]
    await pool.query(query, values)
    await pool.query(query, values2)

    const response = await testServer.executeOperation({
      query: GET_FOLLOWERS,
      variables: {userId: userId1}
    })

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.getFollowers)
      .toEqual([{"username": seedNames[1]}, {"username": seedNames[2]}])
  })

  it('returns the users that a user is following', async () => {
    const userId1 = await getUserId(seedNames[0])
    const userId2 = await getUserId(seedNames[1])
    const userId3 = await getUserId(seedNames[2])

    const query = 
      `INSERT INTO user_followers (user_id, follower_id)
       VALUES ($1, $2)`
    const values = [userId2, userId1]
    const values2 = [userId3, userId1]
    await pool.query(query, values)
    await pool.query(query, values2)

    const response = await testServer.executeOperation({
      query: GET_FOLLOWING,
      variables: {userId: userId1}
    })

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.getFollowing)
      .toEqual([{"username": seedNames[1]}, {"username": seedNames[2]}])
  })
})