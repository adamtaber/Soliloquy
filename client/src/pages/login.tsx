import { useQuery } from "@apollo/client"
import LoginForm from "../components/General/LoginForm"
import { CURRENT_USER } from "../graphql/users/queries"
import { Navigate, useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Login = () => {
  const { loading, data, error } = useQuery(CURRENT_USER)

  if(loading) return null
  if(error) console.log(error)

  return (
    <>
      {data ? <Navigate to='/' /> : <LoginForm />}
    </>
  )
}

export default Login