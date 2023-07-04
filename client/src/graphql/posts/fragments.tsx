import { gql } from "../types";

export const PostFragment = gql(`
  fragment PostFields on Post {
    postId
    content
    imageUrl
    createdOn
    likesCount
    currentUserLike
    poster {
      ...UserFields
    }
  }
`)

export const PostImageSignatureFragment = gql(`
  fragment PostImageSignatureFields on PostImageSignature {
    signature
    timestamp
  }
`)