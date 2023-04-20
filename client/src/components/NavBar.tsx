import { Link } from "react-router-dom"
import LogOut from "./LogOut"

const NavBar = (props: {userId: string}) => {
  return (
    <>
      <Link to='/'>Home</Link>
      <Link to={`/users/${props.userId}`}>Profile</Link>
      <LogOut />
    </>
  )
}

export default NavBar