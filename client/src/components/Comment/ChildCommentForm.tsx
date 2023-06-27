import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_COMMENT } from "../../graphql/comments/mutations"
import { GET_CHILD_COMMENTS, GET_COMMENTS } from "../../graphql/comments/queries"
import { Dispatch, SetStateAction, useContext, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CommentContext from "../../CommentContext"
import { isComment } from "../../graphql/comments/types"

type Inputs = {
  content: string
}

interface IProps {
  postId: string,
  parentCommentId: string,
  setShowReplyForm: Dispatch<SetStateAction<boolean>>,
  commentLevel: number
}

const ChildCommentForm = 
  ({postId, parentCommentId, setShowReplyForm, commentLevel}: IProps) => {
  const { commentId } = useParams()
  const { register, handleSubmit, watch } = useForm<Inputs>()
  const { ref } = register('content')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const navigate = useNavigate()
  const commentContext = useContext(CommentContext)

  const [comment, { data, loading, error }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      {query: GET_COMMENTS, variables: {postId}},
      {query: GET_CHILD_COMMENTS, variables: {
        postId, 
        parentCommentId: commentId
      }},
      {query: GET_CHILD_COMMENTS, variables: {
        postId,
        parentCommentId: parentCommentId
      }}
    ],
    onCompleted: (data) => {
      if(commentContext?.setPreviousCommentId && isComment(data.createComment)) {
        commentContext.setPreviousCommentId(data.createComment.commentId)
      }
    }
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

  const onSubmit: SubmitHandler<Inputs> = (inputs) => {
    comment({ variables: {content: inputs.content, postId, parentCommentId} })
    setShowReplyForm(false)
    if(commentLevel === 9) {
      navigate(`/posts/${postId}/comments/${parentCommentId}`)
    } 
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