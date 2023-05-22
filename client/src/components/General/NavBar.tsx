import { Link } from "react-router-dom"
import LogOut from "./LogOut"

const NavBar = (props: {userId: string, displayname: string}) => {
  return (
    <>
      <Link to='/'> Home </Link>
      <Link to='/messages'> Messages </Link>
      <Link to={`/users/${props.userId}`}> {props.displayname} </Link>
      <LogOut />
    </>
  )
}

export default NavBar