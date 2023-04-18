import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  username: string,
  password: string
}

const Login = () => {
  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data)

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