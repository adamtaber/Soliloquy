import { useQuery } from "@apollo/client"
import { GET_COMMENTS } from "../../graphql/comments/queries"
import { isCommentArray } from "../../graphql/comments/types"
import { Navigate } from "react-router-dom"
import PostCommentForm from "./PostCommentForm"
import PostComment from "./PostComment"

const PostCommentList = (props: { postId: string }) => {
  const { postId } = props

  const {loading, error, data} = useQuery(GET_COMMENTS, {
    variables: { postId }
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isCommentArray(data.getComments)) {
    console.log('invalid comment data')
    return <Navigate to='/' />
  }

  const comments = data.getComments
  console.log(comments)

  return (
    <>
      <PostCommentForm postId={postId} />
      {comments.map((comment) => {
        return (
          <div key={comment.commentId}>
            <PostComment comment={comment} />
          </div>
        )
      })}
    </>
  )
}

export default PostCommentList