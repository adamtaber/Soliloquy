import { useLazyQuery, useQuery } from "@apollo/client"
import { Comment } from "../../graphql/types/graphql"
import { CURRENT_USER } from "../../graphql/users/queries"
import { isUser } from "../../graphql/users/types"
import { Navigate } from "react-router-dom"
import ChildCommentList from "../Comment/ChildCommentList"
import { useState } from "react"
import CommentLevelIndicator from "../Comment/CommentLevelIndicator"
import ExpandThreadButton from "../Comment/ExpandThreadButton"
import CommentHeader from "../Comment/CommentHeader"
import CommentButtons from "../Comment/CommentButtons"
import CommentReplyContainer from "../Comment/CommentReplyContainer"
import { isCommentArray } from "../../graphql/comments/types"
import { GET_CHILD_COMMENTS } from "../../graphql/comments/queries"

interface IProps {
  comment: Comment,
  initialLevel: boolean,
  commentLevel: number
}

const PostComment = ({ comment, initialLevel, commentLevel }: IProps) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [collapseThread, setCollapseThread] = useState(false)
  const { commentId, postId, comments } = comment

  const {loading, error, data} = useQuery(CURRENT_USER)
  if(!data || !isUser(data.currentUser)) return <Navigate to='/'/>
  const currentUser = data.currentUser
 
  const commentClass = 
    `${initialLevel ? 'postComment' : 'childComment'} 
     ${collapseThread ? 'collapsedThread' : ''}`

  
  const validChildren = isCommentArray(comments)

  return (
    <div className={commentClass}>
      <CommentLevelIndicator 
        setCollapseThread={setCollapseThread} 
        collapseThread={collapseThread}
      />
      <ExpandThreadButton 
        setCollapseThread={setCollapseThread}
        collapseThread={collapseThread}
      />
      <CommentHeader 
        collapseThread={collapseThread} 
        comment={comment}
      />
      <div className={`commentBody ${collapseThread && 'collapsedThread'}`}>
        <p>{comment.content}</p>
        <CommentButtons 
          setShowReplyForm={setShowReplyForm}
          setShowOptionsModal={setShowOptionsModal}
          showReplyForm={showReplyForm}
          showOptionsModal={showOptionsModal}
          comment={comment} currentUser={currentUser} 
        />
        {!validChildren && <button>Show More Comments</button>}
        <CommentReplyContainer 
          setShowReplyForm={setShowReplyForm}
          showReplyForm={showReplyForm} comment={comment}
        />
        { validChildren &&
          <ChildCommentList
            commentLevel={commentLevel + 1}
            childComments={comments} 
            postId={postId}
            parentCommentId={commentId}
          />
        }
      </div>
    </div>
  )
}

export default PostComment