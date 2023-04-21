import { gql } from "../types";

export const currentUser = gql(`
  query currentUser {
    currentUser {
      ...UserFields
    }
  }
`)