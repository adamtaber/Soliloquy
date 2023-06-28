import { Outlet } from "react-router-dom"
import { FragmentType, useFragment } from "../../graphql/types"
import { UserFragment } from "../../graphql/users/fragments"
import NavBar from "./NavBar"
import SearchBar from "./SearchBar"

const MainApp = (props: { userData: FragmentType<typeof UserFragment> }) => {
  const user = useFragment(UserFragment, props.userData)
  
  return (
    <div className="nav_body_container">
      <NavBar userId={user.userId} displayname={user.displayname}/>
      <div className="body">
        <Outlet />
      </div>
    </div>
  )
}

export default MainApp