import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_COMMENT } from "../../graphql/comments/mutations"
import { GET_COMMENTS } from "../../graphql/comments/queries"
import { useRef } from "react"

type Inputs = {
  content: string
}

const PostCommentForm = (props: {postId: string}) => {
  const { postId } = props
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>()
  const { ref } = register('content')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleChange = () => {
    if(textAreaRef.current) {
      textAreaRef.current.style.height = "35px"
      const scrollHeight = textAreaRef.current.scrollHeight + "px"
      textAreaRef.current.style.height = scrollHeight
    }
  }

  const [comment, { data, loading, error }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [ GET_COMMENTS ]
  })

  // if(error) console.log(error)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    comment({ variables: {content: data.content, postId} })
    setValue('content', '')
  }


  return (
    <div className="postCommentForm">
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
            className='postForm__input'
            {...register('content', {
              onChange: () => handleChange()
            })} 
            ref={(e) => {
              ref(e)
              textAreaRef.current = e
            }}
          />
        </label>
        <input className="postForm__submit" type="submit" />
      </form>
    </div>
  )
}

export default PostCommentForm