import { useQuery } from "@apollo/client"
import { GET_FOLLOWERS } from "../../graphql/users/queries"
import { isUserArray } from "../../graphql/users/types"
import { Navigate, useNavigate, useParams } from "react-router-dom"

const Followers = () => {
  const navigate = useNavigate()
  const { userId } = useParams()

  if(typeof(userId) !== 'string') return <Navigate to='/'/>

  const followersQuery = useQuery(GET_FOLLOWERS, {
    variables: { userId }
  })

  const followersData =
    followersQuery.data && isUserArray(followersQuery.data.getFollowers)
    ? followersQuery.data.getFollowers
    : ''

  return (
    <div className="followInfo">
      <div className="followInfoSwitchContainer">
        <button className="followInfoSwitch">
          <p>Followers</p>
          <div className="selectedInfoSwitch"></div>
        </button>
        <button className="followInfoSwitch" 
          onClick={() => navigate(`/users/${userId}/following`)}>
          <p>Following</p>
        </button>
      </div>
      <div className="followList">
        {followersData && followersData.map(user => {
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

export default Followers