import { useQuery } from "@apollo/client"
import { Navigate, useParams } from "react-router-dom"
import { GET_POST } from "../graphql/posts/queries"
import { isPost } from "../graphql/posts/types"
import PostCommentList from "../components/Post/PostCommentList"

const Post = () => {
  const { postId } = useParams()

  if(typeof(postId) !== 'string') {
    console.log('invalid parameter')
    return <Navigate to='/'/>
  }

  const {loading, error, data} = useQuery(GET_POST, {
    variables: { postId }
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isPost(data.getPost)) {
    console.log('invalid post')
    return <Navigate to='/' />
  }

  const postData = data.getPost
  const createDate = new Date(postData.createdOn)

  return (
    <div>
      <p>{postData.content}</p>
      <p>{createDate.toLocaleDateString()}</p>
      <p>Comments</p>
      <PostCommentList postId={postId}/>
    </div>
  )
}

export default Post