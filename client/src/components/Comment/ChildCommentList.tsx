import { useQuery } from "@apollo/client"
import { GET_CHILD_COMMENTS, GET_COMMENTS } from "../../graphql/comments/queries"
import { isCommentArray } from "../../graphql/comments/types"
import { useState } from "react"
import ChildComment from "./ChildComment"

//If current comment is on the edge, then when clicking on a child commenst
//move that child comment to the far left (reddit style)

const ChildCommentList = (props: { commentId: string, postId: string }) => {
  // const [showComments, setShowComments] = useState(false)
  const {commentId, postId} = props

  const {loading, error, data} = useQuery(GET_CHILD_COMMENTS, {
    variables: {postId, parentCommentId: commentId}
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data?.getChildComments || !isCommentArray(data.getChildComments)) {
    return null
  }

  const comments = data.getChildComments
  if(comments.length === 0) {
    return null
  }

  return (
    <>
      {/* {showComments
        ? <button onClick={() => setShowComments(false)}>Hide Comments</button>
        : <button onClick={() => setShowComments(true)}>Show Comments</button>
      } */}
      {/* {showComments && */}
      {
       comments.map(comment => {
        return (
          <div key={comment.commentId}>
            <ChildComment comment={comment}/>
          </div>
        )
       })}
      
    </>
  )
}

export default ChildCommentList