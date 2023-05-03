import { Navigate, useParams } from "react-router-dom"
import UserInfo from "../components/User/UserInfo"
import UserPosts from "../components/User/UserPosts"
import UserFollows from "../components/User/UserFollows"

const User = () => {
  const { userId } = useParams()

  if(typeof(userId) !== 'string') {
    console.log('invalid parameter')
    return <Navigate to='/'/>
  }

  return (
    <>
      <UserInfo userId={userId} />
      <UserFollows userId={userId} />
      <UserPosts userId={userId} />
    </>
  )
}

export default User