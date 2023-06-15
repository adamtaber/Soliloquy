import { Navigate } from "react-router-dom";
import { Comment } from "../../graphql/types/graphql";
import { isUser } from "../../graphql/users/types";
import { useQuery } from "@apollo/client";
import { CURRENT_USER } from "../../graphql/users/queries";
import DeleteComment from "../Post/DeleteComment";
import ChildCommentList from "./ChildCommentList";
import ChildCommentForm from "./ChildCommentForm";
import { useState } from "react";
import { IconContext } from "react-icons";
import { RxDotsHorizontal } from "react-icons/rx";

const ChildComment = (props: {comment: Comment}) => {
  const { comment } = props
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [collapseThread, setCollapseThread] = useState(false)

  const {loading, error, data} = useQuery(CURRENT_USER)

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isUser(data.currentUser)) {
    return <Navigate to='/' />
  }

  const currentUser = data.currentUser

  return (
    <div className={`childComment ${collapseThread && 
      'collapsedThread'}`}>
      <div className="levelIndicatorContainer" 
        onClick={() => setCollapseThread(true)}>
          <div className="levelIndicator childLevelIndicator"></div>
      </div>
      {collapseThread && 
        <button className="expandThreadButton childExpandButton" 
          onClick={() => setCollapseThread(false)}>[+]</button>
      }
      <div className={`profilePicSub childProfilePicSub ${collapseThread && 
            'collapsedThread'}`}></div>
      <div className="commentHeader">
        <p className="commentDisplayName">{comment.user.displayname}</p>
        <p className="commentUsername">#{comment.user.username}</p>
      </div>
      {
        // <div className="commentBody">
        // !collapseThread &&
        <div className={`commentBody ${collapseThread && 'collapsedThread'}`}>
          <p>{comment.content}</p>
          <div className="comment__interactButtons">
            {/* <LikeButton 
              likes={postData.likesCount}
              contentId={postData.postId} 
              contentType="post"
              userLiked={postData.currentUserLike ? true : false}
              postType={'page'}
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
          {showReplyForm && 
            <div className="replyFormContainer">
              <div className="levelIndicator commentLevelIndicator"></div>
              <ChildCommentForm parentCommentId={comment.commentId} 
                postId={comment.postId} 
                setShowReplyForm={setShowReplyForm}/>
            </div>
          }
          <ChildCommentList commentId={comment.commentId} postId={comment.postId}/>
        </div>
      }
    </div>
  )
}

export default ChildComment