import assert from "assert"
import { pool } from "../../../../db/config"
import { CREATE_USER } from "./requests"
import { createTestServer } from "../../../../utils"

describe('User Mutations', () => {
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

  it('creates a user', async () => {
    const user = {
      username: 'test',
      displayname: 'test',
      password: 'test',
      email: 'test@test'
    }

    const initialUsersQuery = await pool.query('SELECT * FROM users')
    const initialUsers = initialUsersQuery.rows.length

    const response = await testServer.executeOperation({
      query: CREATE_USER,
      variables: user
    })

    const newUsersQuery = await pool.query('SELECT * FROM users')
    const newUsers = newUsersQuery.rows.length

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(newUsers).toBe(initialUsers + 1)
  })
})