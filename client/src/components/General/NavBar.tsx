import { Link } from "react-router-dom"
import LogOut from "./LogOut"
import { AiFillHome } from 'react-icons/ai'
import { TbMessageCircle } from 'react-icons/tb' 
import { CgProfile } from 'react-icons/cg'
import { IconContext } from "react-icons"

const NavBar = (props: {userId: string, displayname: string}) => {
  return (
    <div className="navbar">
      <Link className="navbarIcon" to='/'>
        <IconContext.Provider value={{style: {display: 'block'}}}>
          <AiFillHome />
        </IconContext.Provider>
      </Link>
      <Link className="navbarIcon" to='/messages'>
        <IconContext.Provider value={{style: {display: 'block'}}}>
          <TbMessageCircle />
        </IconContext.Provider>
      </Link>
      <Link className="navbarIcon" to={`/users/${props.userId}`}> 
        <IconContext.Provider value={{style: {display: 'block'}}}>
          <CgProfile />
        </IconContext.Provider>
      </Link>
      <LogOut />
    </div>
  )
}

export default NavBar