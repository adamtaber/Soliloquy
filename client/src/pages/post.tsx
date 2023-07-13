import { Navigate, useParams } from "react-router-dom"
import PostCommentList from "../components/Post/PostCommentList"
import PostContent from "../components/Post/PostContent"
import { useQuery } from "@apollo/client"
import { CURRENT_USER } from "../graphql/users/queries"
import { isUser } from "../graphql/users/types"
import PostCommentForm from "../components/Post/PostCommentForm"

const Post = () => {
  const { postId, commentId } = useParams()
  if(typeof(postId) !== 'string') return <Navigate to='/'/>
  const {loading, error, data} = useQuery(CURRENT_USER)

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isUser(data.currentUser)) {
    return <Navigate to='/' />
  }

  const currentUser = data.currentUser

  return (
    <div>
      <PostContent postId={postId} currentUser={currentUser}/>
      <PostCommentForm postId={postId} />
      <PostCommentList postId={postId} commentId={commentId}/>
    </div>
  )
}

export default Post