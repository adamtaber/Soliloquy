import { gql } from "../types";

export const PostFragment = gql(`
  fragment CommentFields on Comment {
    postId
    userId
    commentId
    parentCommentId
    content
    createdOn
  }
`)