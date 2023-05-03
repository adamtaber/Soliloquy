import { Outlet } from "react-router-dom"
import { FragmentType, useFragment } from "../../graphql/types"
import { UserFragment } from "../../graphql/users/fragments"
import NavBar from "./NavBar"

const MainApp = (props: { userData: FragmentType<typeof UserFragment> }) => {
  const user = useFragment(UserFragment, props.userData)
  
  return (
    <>
      <NavBar userId={user.userId} displayname={user.displayname}/>
      <Outlet />
    </>
  )
}

export default MainApp