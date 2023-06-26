import { gql } from "../types";

export const GET_COMMENTS = gql(`
  query getComments($postId: String!) {
    getComments(postId: $postId) {
      ...CommentFields
    }
  }
`)

export const GET_CHILD_COMMENTS = gql(`
  query getChildComments($postId: String!, $parentCommentId: String!) {
    getChildComments(postId: $postId, parentCommentId: $parentCommentId) {
      ...CommentFields
    }
  }
`)

export const GET_COMMENT_PARENT_ID = gql(`
  query getCommentParentId($commentId: String!) {
    getCommentParentId(commentId: $commentId)
  }
`)