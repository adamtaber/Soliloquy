import { Link, Navigate } from "react-router-dom"
import LogOut from "./LogOut"
import { useQuery } from "@apollo/client"
import { CURRENT_USER } from "../graphql/users/queries"
import { isUser } from "../graphql/users/types"

const NavBar = (props: {userId: string}) => {
  // const { loading, error, data } = useQuery(CURRENT_USER)
  // if(loading) return null
  // if(error) console.log(error)
  // if(!isUser(data)) {
  //   return (
  //     <Navigate to='/' />
  //   )
  // }

  // const userId = data.userId

  return (
    <>
      <Link to='/'>Home</Link>
      <Link to={`/users/${props.userId}`}>Profile</Link>
      <LogOut />
    </>
  )
}

export default NavBar