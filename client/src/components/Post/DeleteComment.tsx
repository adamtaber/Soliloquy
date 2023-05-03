import { useMutation } from "@apollo/client"
import { DELETE_COMMENT } from "../../graphql/comments/mutations"
import { GET_COMMENTS } from "../../graphql/comments/queries"

const DeleteComment = (props: {commentId: string}) => {
  const {commentId} = props

  const [deleteComment, {loading, error, data}] = useMutation(DELETE_COMMENT, {
    refetchQueries: [ GET_COMMENTS ]
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
      <button onClick={() => onDelete()}>Delete Comment</button>
    </>
  )
}

export default DeleteComment