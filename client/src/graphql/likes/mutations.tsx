import { gql } from "../types";

export const LIKE_CONTENT = gql(`
  mutation likeContent($postId: String, $commentId: String) {
    likeContent(postId: $postId, commentId: $commentId)
  }
`)

export const DELETE_LIKE = gql(`
  mutation deleteLike($postId: String, $commentId: String) {
    deleteLike(postId: $postId, commentId: $commentId)
  }
`)