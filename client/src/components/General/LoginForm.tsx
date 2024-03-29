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
  const { 
    register, 
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Inputs>()

  const fields = watch()

  const [login, { data, loading, error }] = useMutation(LOG_IN, {
    refetchQueries: [
      { query: CURRENT_USER }
    ],
    awaitRefetchQueries: true
  })

  useEffect(() => {
    if (data) navigate('/')
  }, [data])

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    login({ variables: { username: data.username, password: data.password }})
      .catch((err) => console.log(err))
    setValue('username', '')
    setValue('password', '')
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={`loginForm`}>
        <label htmlFor="username">
          <span className="inputType">
            {fields.username?.length ? '' : 'username'}
          </span>
          <input type='text' {...register('username', { required: true })}/>
          {errors.username?.type === 'required' && (
            <span className="inputError">Username is required</span>
          )}
          {error 
            && !fields.username?.length 
            && !(errors.username?.type === 'required')
            && (<span className="inputError">
                  Invalid username or password
                </span>)}
        </label>
        <label htmlFor="password">
        <span className="inputType">
            {fields.password?.length ? '' : 'password'}
          </span>
          <input type='password' {...register('password', { required: true })} />
          {errors.password?.type === 'required' && (
            <span className="inputError">Password is required</span>
          )}
        </label>
        {/* <input className="login__submit" type="submit" /> */}
        <button className="login__submit" type="submit">Log In</button>
      </form>
    </div>
  )
}

export default LoginForm