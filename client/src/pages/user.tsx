import { Link, Navigate, useParams } from "react-router-dom"
import UserInfo from "../components/User/UserInfo"
import UserPosts from "../components/User/UserPosts"
import UserFollows from "../components/User/UserFollows"
import { useQuery } from "@apollo/client"
import { CURRENT_USER } from "../graphql/users/queries"
import { isUser } from "../graphql/users/types"
import PostForm from "../components/Post/PostForm"
import FollowButton from "../components/User/FollowButton"
import { IconContext } from "react-icons"
import { CiChat2 } from "react-icons/ci"
import { RxEnvelopeClosed } from "react-icons/rx"

const User = () => {
  const { userId } = useParams()
  if(typeof(userId) !== 'string') return <Navigate to='/'/>
  const {loading, error, data} = useQuery(CURRENT_USER)

  if(!data || !isUser(data.currentUser)) return <Navigate to='/' />
  const currentUser = data.currentUser

  return (
    <div className="user">
      <div className="user__top">
        <div>
          <UserInfo userId={userId} />
          <UserFollows userId={userId} />
        </div>
        <div className="user__interactButtons">
          {currentUser.userId !== userId &&
            <Link className="messageUserButton" to={`/messages/${userId}`}>
              <IconContext.Provider value={{style: {display: 'block'}}}>
                <RxEnvelopeClosed />
              </IconContext.Provider>
            </Link>
          }
          <div className="user__topRight">
            <FollowButton userId={userId} />
          </div>
        </div>
      </div>
      {currentUser.userId === userId && <PostForm userId={userId}/>}
      <UserPosts userId={userId} />
    </div>
  )
}

export default User