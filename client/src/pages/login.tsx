import { useQuery } from "@apollo/client"
import LoginForm from "../components/General/LoginForm"
import { CURRENT_USER } from "../graphql/users/queries"
import { Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import NewUserForm from "../components/General/NewUserForm"

const Login = () => {
  const [newUser, setNewUser] = useState(false)
  const { loading, data } = useQuery(CURRENT_USER)

  // if(loading) return null
  
  if(newUser) return <NewUserForm setNewUser={setNewUser}/>


  return (
    <div className="login">
      <div className="login__container">
        <h1>Log In</h1>
        {data ? <Navigate to='/' /> : <LoginForm />}
        <p>- OR -</p>
        <button onClick={() => setNewUser(true)}>Sign Up</button>
      </div>
    </div>
  )
}
export default Login