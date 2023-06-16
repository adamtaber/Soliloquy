import { Dispatch, SetStateAction } from "react"
import { Comment } from "../../graphql/types/graphql"
import ChildCommentForm from "./ChildCommentForm"

interface IProps {
  setShowReplyForm: Dispatch<SetStateAction<boolean>>,
  showReplyForm: boolean,
  comment: Comment
}

const CommentReplyContainer = 
  ({setShowReplyForm, showReplyForm, comment}: IProps) => {
    return (
      <div>
        {showReplyForm && 
          <div className="replyFormContainer">
            <div className="levelIndicator commentLevelIndicator"></div>
            <ChildCommentForm parentCommentId={comment.commentId} 
              postId={comment.postId} 
              setShowReplyForm={setShowReplyForm}/>
          </div>
        } 
      </div>
    )
}

export default CommentReplyContainer