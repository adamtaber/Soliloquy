import { useQuery } from "@apollo/client"
import { GET_FOLLOWERS, GET_FOLLOWING } from "../../graphql/users/queries"
import { isUserArray } from "../../graphql/users/types"
import { Navigate } from "react-router-dom"
import FollowButton from "./FollowButton"

const UserFollows = (props: { userId: string } ) => {
  const { userId } = props

  const followersQuery = useQuery(GET_FOLLOWERS, {
    variables: { userId }
  })

  const followingQuery = useQuery(GET_FOLLOWING, {
    variables: { userId }
  })

  if(followersQuery.loading || followingQuery.loading) return null
  if(followersQuery.error) console.log(followersQuery.error)
  if(followingQuery.error) console.log(followingQuery.error)

  if(!followersQuery.data || !isUserArray(followersQuery.data.getFollowers)) {
    console.log('missing follower data')
    return <Navigate to='/' />
  }

  if(!followingQuery.data || !isUserArray(followingQuery.data.getFollowing)) {
    console.log('missing following data')
    return <Navigate to='/' />
  }

  const followersData = followersQuery.data.getFollowers

  const followingData = followingQuery.data.getFollowing
  
  return (
    <>
      <FollowButton userId={userId} followers={followersData}/>
      <p>followers: {followersData.length}</p>
      <p>following: {followingData.length}</p>
    </>
  )
}

export default UserFollows