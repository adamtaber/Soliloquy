import { gql } from "../types";

export const PostFragment = gql(`
  fragment CommentFields on Comment {
    postId
    commentId
    parentCommentId
    content
    createdOn
    likesCount
    currentUserLike
    user {
      ...UserFields
    }
  }
`)