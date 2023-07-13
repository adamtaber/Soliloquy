import { useQuery } from "@apollo/client"
import { CURRENT_USER } from "../../graphql/users/queries"
import { Navigate } from "react-router-dom"
import MainApp from "./MainApp"


const Authenticate = () => {
  const { loading, data, error } = useQuery(CURRENT_USER)

  if(loading) return null
  if(error) console.log(error)

  return (
    <>
      { data && data.currentUser 
        ? <MainApp userData={data.currentUser} /> 
        : <Navigate to='/login' replace />
      } 

    </>
  )
}

export default Authenticate