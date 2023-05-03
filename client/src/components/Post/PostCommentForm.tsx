import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_COMMENT } from "../../graphql/comments/mutations"
import { GET_COMMENTS } from "../../graphql/comments/queries"

type Inputs = {
  content: string
}

const PostCommentForm = (props: {postId: string}) => {
  const { postId } = props
  const { register, handleSubmit } = useForm<Inputs>()

  const [comment, { data, loading, error }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [ GET_COMMENTS ]
  })

  if (loading) console.log('loading...')
  if (error) console.log(error)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    comment({ variables: {content: data.content, postId} })
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

export default PostCommentForm