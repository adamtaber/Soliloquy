import { useQuery } from "@apollo/client"
import { CURRENT_USER, GET_FOLLOWERS } from "../../graphql/users/queries"
import { isUser, isUserArray } from "../../graphql/users/types"
import FollowUser from "./FollowUser"
import UnfollowUser from "./UnfollowUser"

const FollowButton = (props: { userId: string }) => {
  const { userId } = props

  const currentUserQuery = useQuery(CURRENT_USER)
  const followersQuery = useQuery(GET_FOLLOWERS, {
    variables: { userId }
  })

  const currentUserId = 
    currentUserQuery.data && isUser(currentUserQuery.data.currentUser) 
      ? currentUserQuery.data.currentUser.userId
      : ''
  
  const followers =
    followersQuery.data && isUserArray(followersQuery.data.getFollowers)
      ? followersQuery.data.getFollowers
      : ''

  if(currentUserId === userId) return null

  const isFollowing = currentUserId && followers
    ? followers.find(({ userId }) => userId === currentUserId)
    : ''
  
  return (
    <div>
      {isFollowing 
        ? <UnfollowUser userId={userId} />
        : <FollowUser userId={userId} /> 
      }
    </div>
  )
}

export default FollowButton