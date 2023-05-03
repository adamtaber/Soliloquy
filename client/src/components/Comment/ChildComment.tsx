import { Navigate } from "react-router-dom";
import { Comment } from "../../graphql/types/graphql";
import { isUser } from "../../graphql/users/types";
import { useQuery } from "@apollo/client";
import { CURRENT_USER } from "../../graphql/users/queries";
import DeleteComment from "../Post/DeleteComment";
import ChildCommentList from "./ChildCommentList";
import ChildCommentForm from "./ChildCommentForm";

const ChildComment = (props: {comment: Comment}) => {
  const { comment } = props

  const {loading, error, data} = useQuery(CURRENT_USER)

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isUser(data.currentUser)) {
    return <Navigate to='/' />
  }

  const currentUser = data.currentUser

  return (
    <>
      <p>{comment.content}</p>
      {comment.userId === currentUser.userId
        && <DeleteComment commentId={comment.commentId}/>}
      <ChildCommentForm parentCommentId={comment.commentId} postId={comment.postId} />
      <ChildCommentList commentId={comment.commentId} postId={comment.postId}/>
    </>
  )
}

export default ChildComment