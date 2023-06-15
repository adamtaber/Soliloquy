import { useQuery } from "@apollo/client"
import { Comment } from "../../graphql/types/graphql"
import { CURRENT_USER } from "../../graphql/users/queries"
import { isUser } from "../../graphql/users/types"
import { Navigate } from "react-router-dom"
import DeleteComment from "./DeleteComment"
import ChildCommentList from "../Comment/ChildCommentList"
import ChildCommentForm from "../Comment/ChildCommentForm"
import { useState } from "react"
import { IconContext } from "react-icons"
import { RxDotsHorizontal } from "react-icons/rx"
import LikeButton from "../Like/LikeButton"

const PostComment = (props: { comment: Comment}) => {
  const { comment } = props
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [collapseThread, setCollapseThread] = useState(false)

  const {loading, error, data} = useQuery(CURRENT_USER)

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isUser(data.currentUser)) {
    return <Navigate to='/' />
  }

  const currentUser = data.currentUser

  return (
    <div className={`postComment ${collapseThread && 
      'collapsedThread'}`}>
      <div className="levelIndicatorContainer" 
        onClick={() => setCollapseThread(!collapseThread)}>
          <div className="levelIndicator"></div>
      </div>
      {collapseThread && 
        <button className="expandThreadButton" 
          onClick={() => setCollapseThread(false)}>[+]</button>
      }
      <div className="commentHeaderContainer">
        <div className={`profilePicSub ${collapseThread && 
            'collapsedThread'}`}></div>
        <div className="commentHeader">
          <p className="commentDisplayName">{comment.user.displayname}</p>
          <p className="commentUsername">#{comment.user.username}</p>
        </div>
      </div>
      {/* {!collapseThread && */}
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
          <ChildCommentList commentId={comment.commentId} 
            postId={comment.postId}/>
        </div>
      {/* } */}
    </div>
  )
}

export default PostComment