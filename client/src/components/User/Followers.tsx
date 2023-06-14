import { useQuery } from "@apollo/client"
import { FIND_USER, GET_FOLLOWERS } from "../../graphql/users/queries"
import { isUser, isUserArray } from "../../graphql/users/types"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { IconContext } from "react-icons"
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import FollowButton from "./FollowButton"

const Followers = () => {
  const navigate = useNavigate()
  const { userId } = useParams()

  if(typeof(userId) !== 'string') return <Navigate to='/'/>

  const userQuery = useQuery(FIND_USER, {
    variables: { userId }
  })

  const followersQuery = useQuery(GET_FOLLOWERS, {
    variables: { userId }
  })

  const followersData =
    followersQuery.data && isUserArray(followersQuery.data.getFollowers)
    ? followersQuery.data.getFollowers
    : ''
  
  const userData =
    userQuery.data && isUser(userQuery.data.findUser)
    ? userQuery.data.findUser
    : ''

  return (
    <div className="followInfo">
      <div className="followHeaderContainer">
        { userData &&
          <div className="followHeader">
            <button className={'backButton'} 
              onClick={() => navigate(`/users/${userId}`)}>
                <IconContext.Provider value={{style: {display: 'block'}}}>
                  <MdOutlineArrowBackIosNew />
                </IconContext.Provider>        
            </button> 
            <p className="user__displayName">{userData.displayname}</p>
            <p className="user__username">#{userData.username}</p>
          </div>
        }
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
      </div>
      <div className="followList">
        {followersData && followersData.map(user => {
          return (
            <div className="followList__user" onClick={() => navigate(`/users/${user.userId}`)} 
              key={user.userId}>
              <div>
                <p>{user.displayname}</p>
                <p className="followList__username">#{user.username}</p>
              </div>
              <FollowButton userId={user.userId}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Followers