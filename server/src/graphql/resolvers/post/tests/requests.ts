export const CREATE_POST = `
  mutation createPost(
    $content: String!
  ){
    createPost(
      content: $content
    ) {
      content
    }
  }
`

export const DELETE_POST = `
  mutation deletePost(
    $postId: String!
  ){
    deletePost(
      postId: $postId
    )
  }
`

export const GET_USER_POSTS = `
  query getUserPosts(
    $userId: String!
  ){
    getUserPosts(
      userId: $userId
    ){
      content
    }
  }
`