import { useQuery } from "@apollo/client"
import { GET_FOLLOWERS, GET_FOLLOWING } from "../../graphql/users/queries"
import { isUserArray } from "../../graphql/users/types"
import { Link, Navigate } from "react-router-dom"
import FollowButton from "./FollowButton"
import { useEffect, useState } from "react"

const UserFollows = (props: { userId: string } ) => {
  const { userId } = props
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  useEffect(() => {
    setShowFollowers(false)
    setShowFollowing(false)
  }, [userId])

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
      <p onClick={() => setShowFollowers(!showFollowers)}>
        followers: {followersData.length}
      </p>
      {showFollowers && followersData.map(user => {
        return (
          <p key={user.userId}>
            <Link to={`/users/${user.userId}`}>{user.displayname}</Link>
          </p>
        )
      })}
      <p onClick={() => setShowFollowing(!showFollowing)}>
        following: {followingData.length}
      </p>
      {showFollowing && followingData.map(user => {
        return (
          <p key={user.userId}>
            <Link to={`/users/${user.userId}`}>{user.displayname}</Link>
          </p>
        )
      })}
    </>
  )
}

export default UserFollows