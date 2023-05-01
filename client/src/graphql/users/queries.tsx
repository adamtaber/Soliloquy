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