import { useMutation } from "@apollo/client"
import { DELETE_POST } from "../../graphql/posts/mutations"
import { GET_USER_POSTS } from "../../graphql/posts/queries"
import { useNavigate } from "react-router-dom"
import { Post } from "../../graphql/types/graphql"

const DeletePost = (props: {postId: string, userId: string}) => {
  const {postId, userId} = props
  const navigate = useNavigate()

  const [deletePost, {loading, error, data}] = useMutation(DELETE_POST, {
    refetchQueries: [
      {query: GET_USER_POSTS, variables: {userId}}, 
    ],
    update(cache) {
      cache.modify({
        fields: {
          getFeedPosts(existingPosts = []) {
            return existingPosts.filter((post: Post) => {
              return post.postId !== postId
            })
          },
          getUserPosts(existingPosts = []) {
            return existingPosts.filter((post: Post) => {
              return post.postId !== postId
            })
          }
        }
      })
    }
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
      <button className="postOptionsButton deletePostButton" 
        onClick={() => onDelete()}>
          Delete Post
      </button>
    </>
  )
}

export default DeletePost