import { gql } from "../types";

export const CREATE_POST = gql(`
  mutation createPost($content: String!) {
    createPost(content: $content) {
      ...PostFields
    }
  }
`)

export const DELETE_POST = gql(`
  mutation deletePost($postId: String!) {
    deletePost(postId: $postId)
  }
`)