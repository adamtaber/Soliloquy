import { Comment } from "../types/graphql"

export const isComment = (input: any): input is Comment => {
  const comment = (input.userId !== undefined) &&
               (input.commentId !== undefined) &&
               (input.content !== undefined) &&
               (input.createdOn !== undefined) &&
               (input.parentCommentId !== undefined || 
                input.postId !== undefined)
  return comment
}

export const isCommentArray = (input: any): input is Array<Comment> => {
  const initialLength = input.length

  const filteredArray = input.filter(isComment)
  const filteredLength = filteredArray.length

  return initialLength === filteredLength
}