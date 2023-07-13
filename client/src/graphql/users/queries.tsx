import { gql } from "../types";

export const CURRENT_USER = gql(`
  query currentUser {
    currentUser {
      ...UserFields
    }
  }
`)

export const FIND_USER = gql(`
  query findUser($userId: String!) {
    findUser(userId: $userId) {
      ...UserFields
    }
  }
`)

export const SEARCH_USERS = gql(`
  query searchUsers($searchInput: String!) {
    searchUsers(searchInput: $searchInput) {
      ...UserFields
    }
  }
`)

export const GET_FOLLOWERS = gql(`
  query getFollowers($userId: String!) {
    getFollowers(userId: $userId) {
      ...UserFields
    }
  }
`)

export const GET_FOLLOWER_COUNT = gql(`
  query getFollowerCount($userId: String!) {
    getFollowerCount(userId: $userId)
  }
`)

export const GET_FOLLOWING = gql(`
  query getFollowing($userId: String!) {
    getFollowing(userId: $userId) {
      ...UserFields
    }
  }
`)

export const GET_FOLLOWING_COUNT = gql(`
  query getFollowingCount($userId: String!) {
    getFollowingCount(userId: $userId)
  }
`)