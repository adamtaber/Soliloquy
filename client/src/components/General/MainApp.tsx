import { Outlet } from "react-router-dom"
import { FragmentType, useFragment } from "../../graphql/types"
import { UserFragment } from "../../graphql/users/fragments"
import NavBar from "./NavBar"

const MainApp = (props: { userData: FragmentType<typeof UserFragment> }) => {
  const user = useFragment(UserFragment, props.userData)
  
  return (
    <div className="nav_body_container">
      <NavBar userId={user.userId} displayname={user.displayname}/>
      <Outlet />
    </div>
  )
}

export default MainApp