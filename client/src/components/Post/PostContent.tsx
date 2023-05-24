import { useQuery } from "@apollo/client"
import { GET_POST } from "../../graphql/posts/queries"
import { isPost } from "../../graphql/posts/types"
import { Navigate } from "react-router-dom"
import { User } from "../../graphql/types/graphql"
import DeletePost from "./DeletePost"

const PostContent = (params: {postId: string, currentUser: User}) => {
  const { postId, currentUser } = params

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
    <>
      <p>{postData.content}</p>
      <p>{createDate.toLocaleDateString()}</p>
      {currentUser.userId === postData.userId 
      && <DeletePost postId={postId} userId={currentUser.userId}/>}
    </>
  )
}

export default PostContent