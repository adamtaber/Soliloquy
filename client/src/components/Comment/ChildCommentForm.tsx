import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_COMMENT } from "../../graphql/comments/mutations"
import { GET_CHILD_COMMENTS, GET_COMMENTS } from "../../graphql/comments/queries"
import { Dispatch, SetStateAction, useRef } from "react"
import { useParams } from "react-router-dom"

type Inputs = {
  content: string
}

interface IProps {
  postId: string,
  parentCommentId: string,
  setShowReplyForm: Dispatch<SetStateAction<boolean>>,
}

const ChildCommentForm = 
  ({postId, parentCommentId, setShowReplyForm}: IProps) => {
  const { commentId } = useParams()
  const { register, handleSubmit, watch } = useForm<Inputs>()
  const { ref } = register('content')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const [comment, { data, loading, error }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      {query: GET_COMMENTS, variables: {postId}},
      {query: GET_CHILD_COMMENTS, variables: {
        postId, 
        parentCommentId: commentId
      }}
    ]
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
    setShowReplyForm(false)
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
      </form>
    </>
  )
}

export default ChildCommentForm