import { useQuery } from "@apollo/client"
import { GET_CHILD_COMMENTS } from "../../graphql/comments/queries"
import { isCommentArray } from "../../graphql/comments/types"
import PostComment from "../Post/PostComment"
import { Comment } from "../../graphql/types/graphql"
import { useState } from "react"

//If current comment is on the edge, then when clicking on a child commenst
//move that child comment to the far left (reddit style)

interface IProps {
  childComments: Array<Comment>,
  commentLevel: number,
  parentCommentId: string,
  postId: string,
  commentPageId?: string,
  setTestCommentId: (arg: string) => void
}

const ChildCommentList = 
  ({childComments, commentLevel, commentPageId, setTestCommentId }: IProps) => {

  let comments = childComments
  if(comments.length === 0 || !comments) return null
  if(commentLevel >= 10) return null

  return (
    <>
      {
       comments.map(comment => {
        return (
          <div key={comment.commentId}>
            <PostComment 
              comment={comment} 
              initialLevel={false} 
              commentLevel={commentLevel}
              commentPageId={commentPageId}
              setTestCommentId={setTestCommentId}
            />
          </div>
        )
       })}
    </>
  )
}

export default ChildCommentList