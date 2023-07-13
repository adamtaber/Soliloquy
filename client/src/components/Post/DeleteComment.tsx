import { useMutation } from "@apollo/client"
import { DELETE_COMMENT } from "../../graphql/comments/mutations"
import { GET_CHILD_COMMENTS, GET_COMMENTS } from "../../graphql/comments/queries"

const DeleteComment = (props: {commentId: string}) => {
  const {commentId} = props

  const [deleteComment, {loading, error, data}] = useMutation(DELETE_COMMENT, {
    refetchQueries: [ GET_COMMENTS, GET_CHILD_COMMENTS ]
  })

  if(loading) console.log('loading')
  if(error) console.log(error)

  const onDelete = () => {
    deleteComment({
      variables: {commentId}
    })
  }

  return (
    <>
      <button className="postOptionsButton deletePostButton" 
        onClick={() => onDelete()}>Delete Comment</button>
    </>
  )
}

export default DeleteComment