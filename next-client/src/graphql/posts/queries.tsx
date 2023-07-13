import { gql } from "../types";

export const GET_POST = gql(`
  query getPost(
    $postId: String!
  ) {
    getPost(
      postId: $postId
    ) {
      ...PostFields
    }
  }
`)