import { Navigate, useParams } from "react-router-dom"
import UserInfo from "../components/User/UserInfo"
import UserPosts from "../components/User/UserPosts"
import UserFollows from "../components/User/UserFollows"
import { useQuery } from "@apollo/client"
import { CURRENT_USER } from "../graphql/users/queries"
import { isUser } from "../graphql/users/types"
import PostForm from "../components/Post/PostForm"

const User = () => {
  const { userId } = useParams()

  if(typeof(userId) !== 'string') {
    console.log('invalid parameter')
    return <Navigate to='/'/>
  }

  const {loading, error, data} = useQuery(CURRENT_USER)

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isUser(data.currentUser)) {
    return <Navigate to='/' />
  }

  const currentUser = data.currentUser

  return (
    <>
      <UserInfo userId={userId} />
      <UserFollows userId={userId} />
      {currentUser.userId === userId && <PostForm />}
      <UserPosts userId={userId} />
    </>
  )
}

export default User