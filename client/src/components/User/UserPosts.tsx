import { useQuery } from "@apollo/client"
import { GET_USER_POSTS } from "../../graphql/posts/queries"
import { isPostArray } from "../../graphql/posts/types"
import { Navigate, useNavigate } from "react-router-dom"
import LikeButton from "../Like/LikeButton"

const UserPosts = (props: { userId: string } ) => {
  const { userId } = props
  const navigate = useNavigate()

  const {loading, error, data} = useQuery(GET_USER_POSTS, {
    variables: { userId }
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isPostArray(data.getUserPosts)) {
    console.log('missing post data')
    return <Navigate to='/' />
  }

  const postsData = data.getUserPosts.map((post) => {
    let date = new Date(post.createdOn)
    return {
      ...post,
      createdOn: date.toLocaleString()
    }
  })

  const goToPost = (postId: string) => {
    navigate(`/posts/${postId}`)
  }

  return (
    <>
      <p>POSTS</p>
      {postsData.map((post) => {
        return (
          <div key={post.postId}>
            <div onClick={() => goToPost(post.postId)}>
              <p>content: {post.content}</p>  
              <p>date: {post.createdOn}</p>
            </div>
            <LikeButton 
              likes={post.likesCount}
              contentId={post.postId} 
              contentType="post"
              userLiked={post.currentUserLike ? true : false}
            />
          </div>
        )
      })}
    </>
  )
}

export default UserPosts