import { gql } from "../types";

export const CREATE_POST = gql(`
  mutation createPost($content: String!, $imageUrl: String) {
    createPost(content: $content, imageUrl: $imageUrl) {
      ...PostFields
    }
  }
`)

export const DELETE_POST = gql(`
  mutation deletePost($postId: String!) {
    deletePost(postId: $postId)
  }
`)