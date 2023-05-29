import { gql } from "../types";

export const LikeFragment = gql(`
  fragment LikeFields on Like {
    likeId
    userId
    commentId
    postId
    createdOn
  }
`)