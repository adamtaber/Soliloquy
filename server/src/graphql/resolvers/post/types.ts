import { Post } from "../graphql-types"

//might need to alter this a bit since each of these fields aren't
//exlusive to posts

export const isPost = (input: any): input is Post => {
  const post = (input.content !== undefined) &&
               (input.postId !== undefined) &&
               (input.userId !== undefined)
  return post
}

export const isPostArray = (input: any): input is Array<Post> => {
  const initialLength = input.length

  const filteredArray = input.filter(isPost)
  const filteredLength = filteredArray.length

  return initialLength === filteredLength
}