import { Dispatch, SetStateAction } from "react"
import { IconContext } from "react-icons"
import { RxDotsHorizontal } from "react-icons/rx"
import { Comment, User } from "../../graphql/types/graphql"
import DeleteComment from "../Post/DeleteComment"
import LikeButton from "../Like/LikeButton"

interface IProps {
  setShowReplyForm: Dispatch<SetStateAction<boolean>>,
  showReplyForm: boolean,
  setShowOptionsModal: Dispatch<SetStateAction<boolean>>,
  showOptionsModal: boolean,
  comment: Comment,
  currentUser: User
}

const CommentButtons = 
  ({ setShowReplyForm, setShowOptionsModal, showReplyForm, 
     showOptionsModal, comment, currentUser}: IProps) => {
      const { likesCount, commentId, currentUserLike } = comment

      return (
        <div className="comment__interactButtons">
          {/* <LikeButton 
            likes={ likesCount }
            contentId={ commentId } 
            contentType="post"
            userLiked={ currentUserLike ? true : false }
            postType={ 'page' }
          /> */}
          <button className="replyButton" 
            onClick={() => setShowReplyForm(!showReplyForm)}>
              Reply
          </button>
          <button onClick={() => setShowOptionsModal(!showOptionsModal)} 
            className="openModalButton">
              <IconContext.Provider value={{style: {display: 'block'}}}>
                <RxDotsHorizontal />
              </IconContext.Provider>
          </button>
          {showOptionsModal && 
            <div className="commentOptionsModal">
              {comment.user.userId === currentUser.userId
                && <DeleteComment commentId={comment.commentId}/>} 
              <button className="postOptionsButton">Test</button>
            </div>
          }
          {showOptionsModal &&
            <div className="modalWrapper" 
              onClick={() => setShowOptionsModal(false)}></div>
          }
        </div>
      )
}

export default CommentButtons