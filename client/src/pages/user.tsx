import { Navigate, useParams } from "react-router-dom"
import { FIND_USER } from "../graphql/users/queries"
import { useQuery } from "@apollo/client"
import { isUser } from "../graphql/users/types"
import { GET_USER_POSTS } from "../graphql/posts/queries"
import { isPostArray } from "../graphql/posts/types"


const User = () => {
  const { userId } = useParams()

  if(typeof(userId) !== 'string') {
    console.log('invalid parameter')
    return <Navigate to='/'/>
  }

  const userQuery = useQuery(FIND_USER, {
    variables: { userId }
  })

  const postsQuery = useQuery(GET_USER_POSTS, {
    variables: { userId }
  })

  if(userQuery.loading || postsQuery.loading) return null
  if(userQuery.error) console.log(userQuery.error)
  if(postsQuery.error) console.log(postsQuery.error)

  if(!userQuery.data || !isUser(userQuery.data.findUser)) {
    console.log('missing user data')
    return <Navigate to='/' />
  }

  if(!postsQuery.data || !isPostArray(postsQuery.data.getUserPosts)) {
    console.log('missing post data')
    return <Navigate to='/' />
  }

  const userData = userQuery.data.findUser

  const postsData = postsQuery.data.getUserPosts.map((post) => {
    let date = new Date(post.createdOn)
    return {
      ...post,
      createdOn: date.toLocaleString()
    }
  })

  return (
    <>
      <p>USER</p>
      <p>name: {userData.displayname}</p>
      <p>username: {userData.username}</p>
      <p>POSTS</p>
      {postsData.map((post) => {
        return (
          <p key={post.postId}>
            content: {post.content}  
            date: {post.createdOn}
          </p>
        )
      })}
    </>
  )
}

export default User