import { gql } from "../types";

export const CommentFragment = gql(`
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
    comments {
      ...CommentsRecursive
    }
  }
`)

export const AltCommentFragment = gql(`
  fragment AltCommentFields on Comment {
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

export const CommentsRecursive = gql(`
  fragment CommentsRecursive on Comment {
    ...AltCommentFields
    comments {
      ...AltCommentFields
      comments {
        ...AltCommentFields
        comments {
          ...AltCommentFields
          comments {
            ...AltCommentFields
            comments {
              ...AltCommentFields
            }
          }
        }
      }
    }
  }
`)