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
  if(!data || !isCommentArray(data.getComments)) return <Navigate to='/' />

  const comments = data.getComments

  return (
    <>
      <PostCommentForm postId={postId} />
      <div className="postCommentList">
        {comments.map((comment) => {
          return (
            <div key={comment.commentId}>
              <PostComment 
                comment={comment} 
                initialLevel={true}
                commentLevel={1}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default PostCommentList