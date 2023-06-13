import { gql } from "../types";

export const PostFragment = gql(`
  fragment PostFields on Post {
    postId
    content
    createdOn
    likesCount
    currentUserLike
    poster {
      ...UserFields
    }
  }
`)