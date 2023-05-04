import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_COMMENT } from "../../graphql/comments/mutations"
import { GET_CHILD_COMMENTS } from "../../graphql/comments/queries"

type Inputs = {
  content: string
}

const ChildCommentForm = (props: {postId: string, parentCommentId: string}) => {
  const { parentCommentId, postId } = props
  const { register, handleSubmit } = useForm<Inputs>()

  const [comment, { data, loading, error }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [ GET_CHILD_COMMENTS ]
  })

  if (loading) console.log('loading...')
  if (error) console.log(error)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    comment({ variables: {content: data.content, postId, parentCommentId} })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="Comment here..." {...register('content')} />
        <input type="submit" />
      </form>
    </>
  )
}

export default ChildCommentForm