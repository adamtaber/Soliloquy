import { useLazyQuery, useQuery } from "@apollo/client"
import { Comment } from "../../graphql/types/graphql"
import { CURRENT_USER } from "../../graphql/users/queries"
import { isUser } from "../../graphql/users/types"
import { Navigate, useNavigate } from "react-router-dom"
import ChildCommentList from "../Comment/ChildCommentList"
import { useEffect, useRef, useState } from "react"
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
  commentLevel: number,
  commentPageId?: string,
  setTestCommentId: (arg: string) => void,
}

const PostComment = 
  ({ comment, initialLevel, commentLevel, commentPageId, setTestCommentId }: IProps) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [collapseThread, setCollapseThread] = useState(false)
  const { commentId, postId, comments } = comment
  const navigate = useNavigate()

  const myRef = useRef<null | HTMLDivElement>(null)

  const executeScroll = () => {
    if(myRef.current !== null) {
      myRef.current.scrollIntoView()
    }
  }

  useEffect(() => {
    if(commentPageId && initialLevel) {
      executeScroll()
    }
  }, [commentPageId])

  const {loading, error, data} = useQuery(CURRENT_USER)
  if(!data || !isUser(data.currentUser)) return <Navigate to='/'/>
  const currentUser = data.currentUser

  const extendComments = () => {
    navigate(`/posts/${postId}/comments/${comment.parentCommentId}`)
  }
 
  const commentClass = 
    `${initialLevel ? 'postComment' : 'childComment'} 
     ${collapseThread ? 'collapsedThread' : ''}`

  
  const validChildren = (isCommentArray(comments) && comments.length > 0)

  return (
    <div ref={myRef} className={commentClass}>
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
        {/* <p>{commentId}</p> */}
        <p>{comment.content}</p>
        <CommentButtons 
          setShowReplyForm={setShowReplyForm}
          setShowOptionsModal={setShowOptionsModal}
          showReplyForm={showReplyForm}
          showOptionsModal={showOptionsModal}
          comment={comment} currentUser={currentUser} 
          commentPageId={commentPageId}
        />
        {validChildren && commentLevel === 9 && 
          <button className="continueThreadButton" onClick={() => extendComments()}>
            Continue Thread
          </button>
        }
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
            commentPageId={commentPageId}
            setTestCommentId={setTestCommentId}
          />
        }
      </div>
    </div>
  )
}

export default PostComment