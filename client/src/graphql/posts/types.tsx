import { Post, PostImageSignature } from "../types/graphql" 

export const isPost = (input: any): input is Post => {
  const post = (input.postId !== undefined) &&
               (input.content !== undefined) &&
               (input.createdOn !== undefined)
  return post
}

export const isPostArray = (input: any): input is Array<Post> => {
  const initialLength = input.length

  const filteredArray = input.filter(isPost)
  const filteredLength = filteredArray.length

  return initialLength === filteredLength
}

export const isPostImageSignature = (input: any): input is PostImageSignature => {
  const post = (input.signature !== undefined) &&
               (input.timestamp !== undefined)
  return post
}