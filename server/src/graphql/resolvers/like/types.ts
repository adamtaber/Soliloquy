import { Like } from "../graphql-types";

export const isLike = (input: any): input is Like => {
  const like = (input.likeId !== undefined) &&
               (input.userId !== undefined) &&
               ((input.postId !== undefined) ||
               (input.commentId !== undefined))
  return like
}

export const isLikeArray = (input: any): input is Array<Like> => {
  const initialLength = input.length

  const filteredArray = input.filter(isLike)
  const filteredLength = filteredArray.length

  return initialLength === filteredLength
}