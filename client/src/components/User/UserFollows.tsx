import { useQuery } from "@apollo/client"
import { GET_FOLLOWER_COUNT, GET_FOLLOWING_COUNT } from "../../graphql/users/queries"
import { Navigate, useNavigate } from "react-router-dom"

const UserFollows = (props: { userId: string } ) => {
  const navigate = useNavigate()
  const { userId } = props
  if(typeof(userId) !== 'string') return <Navigate to='/'/>

  const followerCount = useQuery(GET_FOLLOWER_COUNT, {
    variables: { userId }
  })

  const followingCount = useQuery(GET_FOLLOWING_COUNT, {
    variables: { userId }
  })

  return (
    <div className="user__followerInfo">
      <div className="followLink" 
        onClick={() => navigate(`/users/${userId}/followers`)}>
        <p>
          <span className="followNumber">
            {followerCount.data?.getFollowerCount}
          </span> Followers
        </p> 
      </div>
      <div className="followLink" 
        onClick={() => navigate(`/users/${userId}/following`)}>
        <p>
          <span className="followNumber">
            {followingCount.data?.getFollowingCount}
          </span> Following
        </p>
      </div>
    </div>
  )
}

export default UserFollows