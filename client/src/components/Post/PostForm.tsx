import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_POST } from "../../graphql/posts/mutations"
import { GET_FEED_POSTS, GET_USER_POSTS } from "../../graphql/posts/queries"

type Inputs = {
  content: string
}

const PostForm = () => {
  const { register, handleSubmit } = useForm<Inputs>()

  const [createPost, { data, loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [ GET_USER_POSTS, GET_FEED_POSTS ]
  })

  if (loading) console.log('loading...')
  if (error) console.log(error)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createPost({ variables: {content: data.content} })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="Post here..." {...register('content')} />
        <input type="submit" />
      </form>
    </>
  )
}

export default PostForm