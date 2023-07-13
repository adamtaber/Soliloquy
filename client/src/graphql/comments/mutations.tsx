import { gql } from "../types";

export const CREATE_COMMENT = gql(`
  mutation createComment($postId: String!, $parentCommentId: String, $content: String!) {
    createComment(postId: $postId, parentCommentId: $parentCommentId, content: $content) {
      ...CommentFields
    }
  }
`)

export const DELETE_COMMENT = gql(`
  mutation deleteComment($commentId: String!) {
    deleteComment(commentId: $commentId)
  }
`)