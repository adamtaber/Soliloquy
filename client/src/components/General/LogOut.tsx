import { useApolloClient, useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { LOG_OUT } from "../../graphql/users/mutations"
import { useEffect } from "react"

const LogOut = () => {
  const client = useApolloClient()
  const navigate = useNavigate()
  const [logout, { data, loading, error }] = useMutation(LOG_OUT)

  useEffect(() => {
    if(data) {
      client.clearStore()
        .then(() =>
          navigate('/login')
        )
    }
  }, [data])
 

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <button onClick={handleLogout}>logout</button>
    </>
  )
}

export default LogOut