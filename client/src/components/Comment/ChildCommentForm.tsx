import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_COMMENT } from "../../graphql/comments/mutations"
import { GET_CHILD_COMMENTS } from "../../graphql/comments/queries"
import { useRef } from "react"

type Inputs = {
  content: string
}

const ChildCommentForm = (props: {postId: string, parentCommentId: string}) => {
  const { parentCommentId, postId } = props
  const { register, handleSubmit, watch } = useForm<Inputs>()
  const { ref } = register('content')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const [comment, { data, loading, error }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [ GET_CHILD_COMMENTS ]
  })

  const handleChange = () => {
    if(textAreaRef.current) {
      textAreaRef.current.style.height = "35px"
      const scrollHeight = textAreaRef.current.scrollHeight + "px"
      textAreaRef.current.style.height = scrollHeight
    }
  }

  if (loading) console.log('loading...')
  if (error) console.log(error)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    comment({ variables: {content: data.content, postId, parentCommentId} })
  }

  return (
    <>
      <form className="home__postForm commentReplyForm" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="content">
          {!watch('content') && 
            <span className="postForm__inputFiller">Comment Here!</span>
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
        <button className="postForm__submit" type='submit'>Reply</button>
        {/* <input className="postForm__submit" type="submit" /> */}
      </form>
    </>
  )
}

export default ChildCommentForm