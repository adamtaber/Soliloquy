import { useQuery } from "@apollo/client"
import { FIND_USER } from "../../graphql/users/queries"
import { isUser } from "../../graphql/users/types"
import { Navigate } from "react-router-dom"

const UserInfo = ( props: { userId: string } ) => {
  const { userId } = props

  const {loading, error, data} = useQuery(FIND_USER, {
    variables: { userId }
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isUser(data.findUser)) {
    console.log('missing user data')
    return <Navigate to='/' />
  }

  const userData = data.findUser

  return (
    <div className="user__basicInfo">
      <p className="user__displayName">{userData.displayname}</p>
      <p className="user__username">#{userData.username}</p>
    </div>
  )
}

export default UserInfo