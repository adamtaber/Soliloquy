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
  postId: string
}

const ChildCommentList = 
  ({childComments, commentLevel, parentCommentId, postId}: IProps) => {
  const [showMoreComments, setShowMoreComments] = useState(false)

  let comments = childComments

  if (commentLevel === 7) {
    const {loading, error, data} = useQuery(GET_CHILD_COMMENTS, {
      variables: {postId, parentCommentId}
    })
    if(!data?.getChildComments || !isCommentArray(data.getChildComments)) {
      return null
    }
    comments = data.getChildComments
  }

  if(comments.length === 0 || !comments) return null

  if(commentLevel === 7 && !showMoreComments) {
    return (
      <>
        <button onClick={() => setShowMoreComments(true)}>
            show more comments
        </button>
      </>
    )
  }

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
            />
          </div>
        )
       })}
    </>
  )
}

export default ChildCommentList