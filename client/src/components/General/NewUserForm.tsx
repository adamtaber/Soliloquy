import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_USER } from "../../graphql/users/mutations"
import { useState } from "react"
import { Navigate } from "react-router-dom"
import { IconContext } from 'react-icons'
import { MdOutlineArrowBackIosNew } from "react-icons/md"

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

const NewUserForm = (props: {setNewUser: (arg0: boolean) => void}) => {
  const { setNewUser } = props
  const [formError, setFormError] = useState('')

  const { register, 
          watch, 
          formState: { errors }, 
          handleSubmit } = useForm<Inputs>()

  const [login, { data, loading, error }] = useMutation(CREATE_USER)
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
        <button className={'backButton'} 
          onClick={() => setNewUser(false)}>
          <IconContext.Provider value={{style: {display: 'block'}}}>
            <MdOutlineArrowBackIosNew />
          </IconContext.Provider>        
        </button> 
        <h1>Sign Up</h1>
        {formError && <p>{formError}</p>}
        <form className="signupForm" onSubmit={handleSubmit(onSubmit)}>
          <label>
            <input 
              {...register('displayname', 
              { required: true, maxLength: 50 })}
              aria-invalid={errors.displayname ? "true" : "false"}
            />
            <span className="inputType">
              {watch('displayname') ? '' : 'displayname'}
            </span>
            {errors.displayname?.type === 'required' 
              && <span className="inputError">displayname is required</span>
            }
            {errors.displayname?.type === 'maxLength' 
              && <span className="inputError">displayname is too long</span>
            }
          </label>
          <label>
            <input 
              {...register('username',
              { required: true, maxLength: 25 })} 
              aria-invalid={errors.username ? "true" : "false"}
            />
            <span className="inputType">
              {watch('username') ? '' : 'username'}
            </span>
            {errors.username?.type === 'required' 
              && <span className="inputError">username is required</span>
            }
            {errors.username?.type === 'maxLength' 
              && <span className="inputError">username is too long</span>
            }
          </label>
          <label>
            <input 
              {...register('email',
              { required: true, maxLength: 255 })} 
              aria-invalid={errors.email ? "true" : "false"}
            />
            <span className="inputType">
              {watch('email') ? '' : 'email'}
            </span>
            {errors.email?.type === 'required' 
              && <span className="inputError">email is required</span>
            }
            {errors.email?.type === 'maxLength' 
              && <span className="inputError">email is too long</span>
            }
          </label>
          <label>
            <input 
              {...register('password',
              { required: true, minLength: 8 })} 
              aria-invalid={errors.password ? "true" : "false"}
            />
            <span className="inputType">
              {watch('password') ? '' : 'password'}
            </span>
            {errors.password?.type === 'required' 
              && <span className="inputError">password is required</span>
            }
            {errors.password?.type === 'minLength' 
              && <span className="inputError">password is too short</span>
            }
          </label>
          <label>
            <input 
              {...register('passwordConfirm',
              { required: true, validate:  (val: string) => {
                if (watch('password') != val) {
                  return 'passwords do not match'
                }
              }})} 
              aria-invalid={errors.password ? "true" : "false"}
            />
            <span className="inputType">
              {watch('passwordConfirm') ? '' : 'confirm password'}
            </span>
            {errors.passwordConfirm?.type === 'required' 
              && <span className="inputError">password is required</span>
            }
            {errors.passwordConfirm?.type === 'validate' 
              && <span className="inputError">{errors.passwordConfirm?.message}</span>
            }
          </label>
          <input className="signup__submit" type="submit" />
        </form>
      </div>
    </div>
  )
}

export default NewUserForm