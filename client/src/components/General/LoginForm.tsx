import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { LOG_IN } from "../../graphql/users/mutations"
import { CURRENT_USER } from "../../graphql/users/queries"
import { useEffect } from "react"

type Inputs = {
  username: string,
  password: string
}

const LoginForm = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<Inputs>()

  const [login, { data, loading, error }] = useMutation(LOG_IN, {
    refetchQueries: [
      { query: CURRENT_USER }
    ],
    awaitRefetchQueries: true
  })

  if (loading) console.log('loading...')
  if (error) console.log(error)

  useEffect(() => {
    if (data) navigate('/')
  }, [data])

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    login({ variables: { username: data.username, password: data.password }})
  }

  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="username" {...register('username')} />
        <input defaultValue="password" {...register('password')} />
        <input type="submit" />
      </form>
    </div>
  )
}

export default LoginForm