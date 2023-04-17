export const CREATE_COMMENT = `
  mutation createComment (
    $postId: String!,
    $content: String!,
    $parentCommentId: String
  ){
    createComment(
      postId: $postId,
      content: $content,
      parentCommentId: $parentCommentId
    ){
      content
    }
  }
`

export const DELETE_COMMENT = `
  mutation deleteComment (
    $commentId: String!
  ){
    deleteComment(
      commentId: $commentId
    )
  }
`

export const GET_COMMENTS = `
  query getComments (
    $postId: String!
  ){
    getComments(
      postId: $postId
    ){
      content
    }
  }
`