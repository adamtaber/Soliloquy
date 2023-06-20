import { useQuery } from "@apollo/client"
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

interface IProps {
  comment: Comment,
  initialLevel: boolean
}

const PostComment = ({ comment, initialLevel }: IProps) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [collapseThread, setCollapseThread] = useState(false)

  const {loading, error, data} = useQuery(CURRENT_USER)

  // if(loading) return null
  if(error) console.log(error)
  if(!data || !isUser(data.currentUser)) return <Navigate to='/'/>

  const currentUser = data.currentUser
  const { commentId, postId, comments } = comment

  const commentClass = 
    `${initialLevel ? 'postComment' : 'childComment'} 
     ${collapseThread ? 'collapsedThread' : ''}`

  console.log(comment)
  console.log(comments)
  
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
        <CommentReplyContainer 
          setShowReplyForm={setShowReplyForm}
          showReplyForm={showReplyForm} comment={comment}
        />
        { validChildren &&
          <ChildCommentList
            childComments={comments} 
            commentId={commentId} 
            postId={postId}
          />
        }
      </div>
    </div>
  )
}

export default PostComment