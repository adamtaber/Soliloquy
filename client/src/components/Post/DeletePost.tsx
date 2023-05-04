import { useMutation } from "@apollo/client"
import { DELETE_POST } from "../../graphql/posts/mutations"
import { GET_FEED_POSTS, GET_USER_POSTS } from "../../graphql/posts/queries"

const DeletePost = (props: {postId: string}) => {
  const {postId} = props

  const [deletePost, {loading, error, data}] = useMutation(DELETE_POST, {
    refetchQueries: [ GET_USER_POSTS, GET_FEED_POSTS ]
  })

  if(loading) console.log('loading')
  if(error) console.log(error)

  const onDelete = () => {
    deletePost({
      variables: {postId}
    })
  }

  return (
    <>
      <button onClick={() => onDelete()}>Delete Post</button>
    </>
  )
}

export default DeletePost