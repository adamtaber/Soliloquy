import { Post } from "../graphql-types"
import { isUser } from "../user/types"

//might need to alter this a bit since each of these fields aren't
//exlusive to posts

export const isPost = (input: any): input is Post => {
  const post = (input.content !== undefined) &&
               (input.postId !== undefined) &&
               (input.likesCount !== undefined) &&
               (input.currentUserLike !== undefined) &&
               (input.createdOn !== undefined) &&
               (isUser(input.poster))
  return post
}

export const isPostArray = (input: any): input is Array<Post> => {
  const initialLength = input.length

  const filteredArray = input.filter(isPost)
  const filteredLength = filteredArray.length

  return initialLength === filteredLength
}