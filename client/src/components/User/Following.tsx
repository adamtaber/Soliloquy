import { useQuery } from "@apollo/client"
import { GET_FOLLOWING } from "../../graphql/users/queries"
import { isUserArray } from "../../graphql/users/types"
import { Navigate, useNavigate, useParams } from "react-router-dom"

const Following = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  if(typeof(userId) !== 'string') return <Navigate to='/'/>

  const followingQuery = useQuery(GET_FOLLOWING, {
    variables: { userId }
  })

  const followingData =
    followingQuery.data && isUserArray(followingQuery.data.getFollowing)
    ? followingQuery.data.getFollowing
    : ''

  return (
    <div className="followInfo">
      <div className="followInfoSwitchContainer">
        <button className="followInfoSwitch" 
          onClick={() => navigate(`/users/${userId}/followers`)}>
          <p>Followers</p>
        </button>
        <button className="followInfoSwitch">
          <p>Following</p>
          <div className="selectedInfoSwitch"></div>
        </button>
      </div>
      <div className="followList">
        {followingData && followingData.map(user => {
          return (
            <div className="followList__user" onClick={() => navigate(`/users/${user.userId}`)} 
              key={user.userId}>
              <p>{user.displayname}</p>
              <p className="followList__username">#{user.username}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Following