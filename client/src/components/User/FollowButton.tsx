import { useQuery } from "@apollo/client"
import { CURRENT_USER } from "../../graphql/users/queries"
import { isUser } from "../../graphql/users/types"
import { Navigate } from "react-router-dom"
import FollowUser from "./FollowUser"
import { User } from "../../graphql/types/graphql"
import UnfollowUser from "./UnfollowUser"

const FollowButton = (props: { userId: string, followers: Array<User> }) => {
  const { userId, followers } = props

  const currentUserQuery = useQuery(CURRENT_USER)

  if(currentUserQuery.loading) return null
  if(currentUserQuery.error) console.log(currentUserQuery.error)
  if(!currentUserQuery.data || !isUser(currentUserQuery.data.currentUser)) {
    return <Navigate to='/' />
  }

  const currentUserId = currentUserQuery.data.currentUser.userId
  if(currentUserId === userId) return null

  const isFollowing = followers.find(({ userId }) => userId === currentUserId)

  return (
    <>
      {isFollowing 
        ? <UnfollowUser userId={userId} />
        : <FollowUser userId={userId} /> 
      }
    </>
  )
}

export default FollowButton