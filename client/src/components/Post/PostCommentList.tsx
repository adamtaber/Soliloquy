import { useLazyQuery, useQuery } from "@apollo/client"
import { GET_CHILD_COMMENTS, GET_COMMENTS, GET_COMMENT_PARENT_ID } from "../../graphql/comments/queries"
import { isCommentArray } from "../../graphql/comments/types"
import { useNavigate } from "react-router-dom"
import PostCommentForm from "./PostCommentForm"
import PostComment from "./PostComment"
import { useEffect, useState } from "react"

interface IProps {
  postId: string,
  commentId?: string
}

const PostCommentList = ({ postId, commentId }: IProps) => {
  const navigate = useNavigate()
  const [getChildren, childrenQuery] = useLazyQuery(GET_CHILD_COMMENTS)
  const [getParentId, parentIdQuery] = useLazyQuery(GET_COMMENT_PARENT_ID)
  const getComments = useQuery(GET_COMMENTS, {variables: {postId}})
  const [testCommentId, setTestCommentId] = useState<string>("")
  
  useEffect(() => {
    if(commentId) {
      getChildren({variables: {
        postId,
        parentCommentId: commentId
      }})

      getParentId({variables: {
        commentId
      }})
    } 
  }, [commentId])

  const returnToParent = () => {
    if(parentIdQuery.data?.getCommentParentId) {
      navigate(`/posts/${postId}/comments/${parentIdQuery.data?.getCommentParentId}`)
    } 
    else {
      navigate(`/posts/${postId}/`)
    }
  }

  const comments = isCommentArray(childrenQuery.data?.getChildComments) && commentId
    ? childrenQuery.data?.getChildComments
    : getComments.data?.getComments

  return (
    <>
      <PostCommentForm postId={postId} />
      {/* <button onClick={() => executeScroll()}>click</button> */}
      {/* <div ref={myRef}>
        test
      </div> */}
      {commentId && 
        <button className="parentCommentsButton" onClick={() => returnToParent()}>
          Show parent comments
        </button>}
      <div className="postCommentList">
        {isCommentArray(comments) && comments.map((comment) => {
          return (
            <div key={comment.commentId}>
              <PostComment 
                comment={comment} 
                initialLevel={true}
                commentLevel={1}
                commentPageId={commentId}
                setTestCommentId={setTestCommentId}
              />
            </div>
          )
        })}
      </div>
      
    </>
  )
}

export default PostCommentList