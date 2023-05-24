import { useMutation } from "@apollo/client"
import { DELETE_POST } from "../../graphql/posts/mutations"
import { GET_FEED_POSTS, GET_USER_POSTS } from "../../graphql/posts/queries"
import { useNavigate } from "react-router-dom"

const DeletePost = (props: {postId: string, userId: string}) => {
  const {postId, userId} = props
  const navigate = useNavigate()

  const [deletePost, {loading, error, data}] = useMutation(DELETE_POST, {
    refetchQueries: [
      {query: GET_USER_POSTS, variables: {userId}}, 
      {query: GET_FEED_POSTS}
    ]
  })

  if(loading) console.log('loading')
  if(error) console.log(error)

  const onDelete = () => {
    deletePost({
      variables: {postId}
    })
    navigate('/')
  }

  return (
    <>
      <button onClick={() => onDelete()}>Delete Post</button>
    </>
  )
}

export default DeletePost