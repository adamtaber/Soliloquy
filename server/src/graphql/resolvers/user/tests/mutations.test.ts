import assert from "assert"
import { pool } from "../../../../db/config"
import { CREATE_USER, DELETE_USER, FOLLOW_USER, UNFOLLOW_USER, UPDATE_USER } from "./requests"
import { createTestServer } from "../../../../utils"
import { getUserId, seedNames, seedUsers } from './helper'

describe('User Mutations', () => {
  const testServer = createTestServer()

  beforeEach(async () => {
    await pool.query('DELETE FROM users')
    await seedUsers()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('creates a user', async () => {
    const user = {
      username: 'user',
      displayname: 'user',
      password: 'user',
      email: 'user@user'
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
    const duplicateUser = {
      username: 'test1',
      displayname: 'test1',
      password: 'test',
      email: 'test@test'
    }

    const initialUsersQuery = await pool.query('SELECT * FROM users')
    const initialUsers = initialUsersQuery.rows.length

    await testServer.executeOperation({
      query: CREATE_USER,
      variables: duplicateUser
    })    
    
    const newUsersQuery = await pool.query('SELECT * FROM users')
    const newUsers = newUsersQuery.rows.length

    expect(newUsers).toBe(initialUsers)
  })

  it('updates a user', async () => {
    const id = await getUserId(seedNames[0])

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
    expect(updatedUser.email).toBe('test1@test')
  })

  it('deletes a user', async () => {
    const initialUsersQuery = await pool.query("SELECT * FROM users")
    const initialUsersCount = initialUsersQuery.rows.length

    const id = await getUserId(seedNames[0])

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

    const id = await getUserId(seedNames[0])
    const id2 = await getUserId(seedNames[1])

    await testServer.executeOperation(
      {
        query: FOLLOW_USER,
        variables: {followUserId: id2}
      },
      {
        contextValue: {
          authorizedId: id
        }
      }
    )

    const newFollowerQuery = await pool.query('SELECT * FROM user_followers')
    const newFollowers = newFollowerQuery.rows

    expect(newFollowers.length).toEqual(followers.length + 1)
    expect(newFollowers[0].user_id).toBe(id2)
    expect(newFollowers[0].follower_id).toBe(id)
  })

  it('unfollows a user', async () => {
    const id = await getUserId(seedNames[0])
    const id2 = await getUserId(seedNames[1])

    const followQuery =
      `INSERT INTO user_followers (user_id, follower_id)
       VALUES ($1, $2)`
    const values = [id, id2]
    await pool.query(followQuery, values)

    const followerQuery = await pool.query('SELECT * FROM user_followers')
    const followers = followerQuery.rows

    await testServer.executeOperation(
      {
        query: UNFOLLOW_USER,
        variables: {userId: id}
      },
      {
        contextValue: {
          authorizedId: id2
        }
      }
    )

    const newFollowerQuery = await pool.query('SELECT * FROM user_followers')
    const newFollowers = newFollowerQuery.rows

    expect(newFollowers.length).toEqual(followers.length - 1)
  })
})