import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_POST } from "../../graphql/posts/mutations"
import { GET_FEED_POSTS, GET_USER_POSTS } from "../../graphql/posts/queries"
import { useRef } from "react"

type Inputs = {
  content: string
}

const PostForm = (props: {userId: string}) => {
  const { userId } = props
  const { register, handleSubmit, watch } = useForm<Inputs>()
  const { ref } = register('content')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  
  const handleChange = () => {
    if(textAreaRef.current) {
      textAreaRef.current.style.transition = 'none'
      const initHeight = textAreaRef.current.style.height
      console.log(initHeight)
      textAreaRef.current.style.height = "100px"
      const scrollHeight = textAreaRef.current.scrollHeight + "px"
      console.log(initHeight)
      textAreaRef.current.style.height = initHeight
      textAreaRef.current.style.transition = 'height 0.5s'
      console.log(textAreaRef.current.style.height, scrollHeight)
      textAreaRef.current.style.height = scrollHeight
      // setTimeout(() => {
      //   if(textAreaRef.current) {
      //     const scrollHeight = textAreaRef.current.scrollHeight + "px"
      //     textAreaRef.current.style.height = scrollHeight
      //   }
      // }, 0)
    }
  }

  const handleBlur = () => {
    console.log('test')
    if(textAreaRef.current && !watch('content').length) {
      // textAreaRef.current.style.height = "35px";
      textAreaRef.current.removeAttribute('style')
    }
  }

  const [createPost, { data, loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {query: GET_FEED_POSTS}, 
      {query: GET_USER_POSTS, variables: {userId}}
    ]
  })

  if (loading) console.log('loading...')
  if (error) console.log(error)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createPost({ variables: {content: data.content} })
  }

  const inputClass = watch('content') ? 'postForm__input__content' : ''

  return (
    <>
      <form className="home__postForm" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="content">
          {!watch('content') && 
            <span className="postForm__inputFiller">Post something here!</span>
          }
          {watch('content') && 
            <span className="postForm__charCount">
              {watch('content').length}/500
            </span>
          }
          <textarea 
            className={`postForm__input ${inputClass}`} 
            {...register('content', {
              onChange: () => handleChange(),
              onBlur: () => handleBlur()
            })} 
            // rows={1}
            ref={(e) => {
              ref(e)
              textAreaRef.current = e
            }}
          />
        </label>
        <input className="postForm__submit" type="submit" />
      </form>
    </>
  )
}

export default PostForm