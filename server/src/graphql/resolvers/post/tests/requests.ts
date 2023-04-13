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