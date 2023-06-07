import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_USER } from "../../graphql/users/mutations"
import { useState } from "react"
import { Navigate } from "react-router-dom"

type Inputs = {
  displayname: string,
  username: string,
  email: string,
  password: string,
  passwordConfirm: string
}

//Add purple checkmarks whenever a form entry is valid

//Maybe add a feature that checks if a username/email is valid
//right after they stop typing, or even as they're typing

const NewUserForm = () => {
  const [formError, setFormError] = useState('')

  const { register, 
          watch, 
          formState: { errors }, 
          handleSubmit } = useForm<Inputs>()

  const [login, { data, loading }] = useMutation(CREATE_USER)
  if (loading) console.log('loading...')
  if (data) return <Navigate to='/'/>

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    login({ variables: 
      { displayname: data.displayname,
        username: data.username, 
        email: data.email,
        password: data.password }
    }).catch(err => setFormError(err.message))
  }

  return (
    <div className="signup">
      <div className="signup__container">
        <h1>Sign Up</h1>
        {/* <p>{formError}</p> */}
        <form className="signupForm" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input 
              defaultValue="displayname" 
              {...register('displayname', 
              { required: true, maxLength: 50 })}
              aria-invalid={errors.displayname ? "true" : "false"}
            />
            {errors.displayname?.type === 'required' 
              && <p>displayname is required</p>
            }
            {errors.displayname?.type === 'maxLength' 
              && <p>displayname is too long</p>
            }
          </div>
          <div>
            <input 
              defaultValue="username" 
              {...register('username',
              { required: true, maxLength: 25 })} 
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username?.type === 'required' 
              && <p>username is required</p>
            }
            {errors.username?.type === 'maxLength' 
              && <p>username is too long</p>
            }
          </div>
          <div>
            <input 
              defaultValue="email" 
              {...register('email',
              { required: true, maxLength: 255 })} 
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email?.type === 'required' 
              && <p>email is required</p>
            }
            {errors.email?.type === 'maxLength' 
              && <p>email is too long</p>
            }
          </div>
          <div>
            <input 
              defaultValue="password" 
              {...register('password',
              { required: true, minLength: 8 })} 
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password?.type === 'required' 
              && <p>password is required</p>
            }
            {errors.password?.type === 'minLength' 
              && <p>password is too short</p>
            }
          </div>
          <div>
            <input 
              defaultValue="confirm password" 
              {...register('passwordConfirm',
              { required: true, validate:  (val: string) => {
                if (watch('password') != val) {
                  return 'passwords do not match'
                }
              }})} 
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.passwordConfirm?.type === 'required' 
              && <p>password is required</p>
            }
            {errors.passwordConfirm?.type === 'validate' 
              && <p>{errors.passwordConfirm?.message}</p>
            }
          </div>
          <input className="signup__submit" type="submit" />
        </form>
      </div>
    </div>
  )
}

export default NewUserForm