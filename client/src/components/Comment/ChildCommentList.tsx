import { useQuery } from "@apollo/client"
import { GET_CHILD_COMMENTS } from "../../graphql/comments/queries"
import { isCommentArray } from "../../graphql/comments/types"
import PostComment from "../Post/PostComment"

//If current comment is on the edge, then when clicking on a child commenst
//move that child comment to the far left (reddit style)

const ChildCommentList = (props: { commentId: string, postId: string }) => {
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

  if(comments.length === 0) return null

  return (
    <>
      {
       comments.map(comment => {
        return (
          <div key={comment.commentId}>
            <PostComment comment={comment} initialLevel={false}/>
          </div>
        )
       })}
    </>
  )
}

export default ChildCommentList