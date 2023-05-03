import { gql } from "../types";

export const LOG_IN = gql(`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`)

export const LOG_OUT = gql(`
  mutation logout{
    logout
  }
`)

export const FOLLOW_USER = gql(`
  mutation followUser($followUserId: String!) {
    followUser(followUserId: $followUserId)
  }
`)

export const UNFOLLOW_USER = gql(`
  mutation unfollowUser($userId: String!) {
    unfollowUser(userId: $userId)
  }
`)