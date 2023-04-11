import assert from "assert"
import { CREATE_USER, GET_USER, GET_USERS } from './requests'
import { pool } from "../../../../db/config"
import { createTestServer } from "../../../../utils"

describe('User Queries', () => {
  const testServer = createTestServer()

  beforeEach(async () => {
    await pool.query('START TRANSACTION')
  })

  afterEach(async () => {
    await pool.query('ROLLBACK')
  })

  afterAll(async () => {
    await pool.end()
  })

  it('returns all users', async () => {
    const user1 = {
      displayname: 'test1',
      username: 'test1',
      password: 'test',
      email: 'test1@test'
    }

    const user2 = {
      displayname: 'test2',
      username: 'test2',
      password: 'test',
      email: 'test2@test'
    }

    const user3 = {
      displayname: 'test3',
      username: 'test3',
      password: 'test',
      email: 'test3@test'
    }

    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user1
    })

    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user2
    })

    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user3
    })

    const response = await testServer.executeOperation({
      query: GET_USERS
    })  

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.allUsers)
      .toEqual([{"username": 'test1'}, {"username": 'test2'}, {"username": 'test3'}])
  })

  it('finds a specific user', async () => {
    const user1 = {
      displayname: 'test1',
      username: 'test1',
      password: 'test',
      email: 'test1@test'
    }

    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user1
    })

    const userQuery = await pool.query('SELECT * FROM users')
    const userId = userQuery.rows[0].user_id

    const response = await testServer.executeOperation({
      query: GET_USER,
      variables: { userId }
    })

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.findUser).toEqual({username: 'test1'})
  })
})