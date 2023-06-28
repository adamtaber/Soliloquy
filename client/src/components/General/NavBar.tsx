import { Link } from "react-router-dom"
import LogOut from "./LogOut"
import { CiChat2 } from 'react-icons/ci'
import { CiHome } from 'react-icons/ci'
import { CiUser } from 'react-icons/ci'
import { CiSearch } from 'react-icons/ci'
import { IconContext } from "react-icons"

const NavBar = (props: {userId: string, displayname: string}) => {
  return (
    <div className="navbar">
      <Link className="navbarIcon" to='/'>
        <IconContext.Provider value={{style: {display: 'block'}}}>
          <CiHome />
        </IconContext.Provider>
      </Link>
      <Link className="navbarIcon" to='/search'>
        <IconContext.Provider value={{style: {display: 'block'}}}>
          <CiSearch />
        </IconContext.Provider>
      </Link>
      <Link className="navbarIcon" to='/messages'>
        <IconContext.Provider value={{style: {display: 'block'}}}>
          <CiChat2 />
        </IconContext.Provider>
      </Link>
      <Link className="navbarIcon" to={`/users/${props.userId}`}> 
        <IconContext.Provider value={{style: {display: 'block'}}}>
          <CiUser />
        </IconContext.Provider>
      </Link>
      <LogOut />
    </div>
  )
}

export default NavBar