import assert from "assert"
import { pool } from "../../../../db/config"
import { CREATE_USER, DELETE_USER, FOLLOW_USER, UPDATE_USER } from "./requests"
import { createTestServer } from "../../../../utils"

const user = {
  username: 'test',
  displayname: 'test',
  password: 'test',
  email: 'test@test'
}

const user2 = {
  username: 'test2',
  displayname: 'test2',
  password: 'test',
  email: 'test2@test'
}

describe('User Mutations', () => {
  const testServer = createTestServer()

  beforeEach(async () => {
    // await pool.query('START TRANSACTION')
    await pool.query('DELETE FROM users')
  })

  afterEach(async () => {
    // await pool.query('ROLLBACK')
    // await pool.query('DELETE FROM users')
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

  it("doesn't create a user with duplicate info", async () => {
    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user
    })

    const initialUsersQuery = await pool.query('SELECT * FROM users')
    const initialUsers = initialUsersQuery.rows.length

    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user
    })    
    
    const newUsersQuery = await pool.query('SELECT * FROM users')
    const newUsers = newUsersQuery.rows.length

    expect(newUsers).toBe(initialUsers)
  })

  it('creates then updates a user', async () => {
    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user
    })

    const newUser = await pool.query("SELECT user_id FROM users WHERE displayname = 'test'")
    const id = newUser.rows[0].user_id

    const response = await testServer.executeOperation(
      {
        query: UPDATE_USER,
        variables: {username: "update", displayname: "update"}
      },
      {
        contextValue: {
          authorizedId: id
        }
      }
    )

    const updatedUserQuery = await pool.query("SELECT * FROM users WHERE user_id = $1", [id])
    const updatedUser = updatedUserQuery.rows[0]

    assert(response.body.kind === 'single')
    expect(updatedUser.username).toBe('update')
    expect(updatedUser.displayname).toBe('update')
    expect(updatedUser.email).toBe('test@test')
  })

  it('creates then deletes a user', async () => {
    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user
    })

    const newUser = await pool.query("SELECT user_id FROM users WHERE username = 'test'")
    const id = newUser.rows[0].user_id

    const initialUsersQuery = await pool.query("SELECT * FROM users")
    const initialUsersCount = initialUsersQuery.rows.length

    await testServer.executeOperation(
      {
        query: DELETE_USER,
      },
      {
        contextValue: {
          authorizedId: id
        }
      }
    )

    const newUsersQuery = await pool.query("SELECT * FROM users")
    const newUsersCount = newUsersQuery.rows.length

    expect(newUsersCount).toEqual(initialUsersCount - 1)
  })

  it('follows a user', async () => {
    const followerQuery = await pool.query('SELECT * FROM user_followers')
    const followers = followerQuery.rows

    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user
    })

    await testServer.executeOperation({
      query: CREATE_USER,
      variables: user2
    })

    const userIdQuery = await pool.query("SELECT user_id FROM users WHERE username = 'test'")
    const userId = userIdQuery.rows[0].user_id
    
    const user2IdQuery = await pool.query("SELECT user_id FROM users WHERE username = 'test2'")
    const user2Id = user2IdQuery.rows[0].user_id

    await testServer.executeOperation(
      {
        query: FOLLOW_USER,
        variables: {followUserId: user2Id}
      },
      {
        contextValue: {
          authorizedId: userId
        }
      }
    )

    const newFollowerQuery = await pool.query('SELECT * FROM user_followers')
    const newFollowers = newFollowerQuery.rows

    expect(newFollowers.length).toEqual(followers.length + 1)
    expect(newFollowers[0].user_id).toBe(user2Id)
    expect(newFollowers[0].follower_id).toBe(userId)
  })
})