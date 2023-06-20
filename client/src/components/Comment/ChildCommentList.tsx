import { useQuery } from "@apollo/client"
import { GET_CHILD_COMMENTS } from "../../graphql/comments/queries"
import { isCommentArray } from "../../graphql/comments/types"
import PostComment from "../Post/PostComment"
import { Comment } from "../../graphql/types/graphql"

//If current comment is on the edge, then when clicking on a child commenst
//move that child comment to the far left (reddit style)

const ChildCommentList = (props: { commentId: string, postId: string, childComments: Array<Comment> }) => {
  const {commentId, postId, childComments} = props

  // const {loading, error, data} = useQuery(GET_CHILD_COMMENTS, {
  //   variables: {postId, parentCommentId: commentId}
  // })

  // if(loading) return null
  // if(error) console.log(error)
  // if(!data?.getChildComments || !isCommentArray(data.getChildComments)) {
  //   return null
  // }

  // const comments = data.getChildComments

  // if(comments.length === 0) return null
  const comments = childComments
  if(comments.length === 0 || !comments) return null

  return (
    <>
      {
       comments.map(comment => {
        return (
          <div key={comment.commentId}>
            <PostComment comment={comment} initialLevel={false}/>
          </div>
        )
       })}
    </>
  )
}

export default ChildCommentList