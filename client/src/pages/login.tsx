import { useMutation } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { LOG_IN } from '../graphql/users/mutations' 
import { currentUser } from '../graphql/users/queries'
import Loader from './loader'
import { useNavigate } from 'react-router-dom'

type Inputs = {
  username: string,
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<Inputs>()
  const [login, { data, loading, error }] = useMutation(LOG_IN, {
    refetchQueries: [
      { query: currentUser }
    ],
    awaitRefetchQueries: true
  })

  if (loading) console.log('loading...')
  if (error) console.log(error)
  if (data) navigate('/')

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

export default Login