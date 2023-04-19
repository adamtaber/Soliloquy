import { useQuery } from "@apollo/client"
import { currentUser } from "../graphql/users/queries"
import Loader from "../pages/loader"
import { Navigate, useNavigate } from "react-router-dom"

//add type for props
const Authenticate = ({children}: any) => {
  const { loading, data, error } = useQuery(currentUser)

  if(loading) {
    console.log('loading...')
  }

  return (
    <>
      {data ? children : <Navigate to='/login' replace />}
    </>
  )
}

export default Authenticate