import { useQuery } from "@apollo/client"
import { GET_POST } from "../../graphql/posts/queries"
import { isPost } from "../../graphql/posts/types"
import { Navigate, useNavigate } from "react-router-dom"
import { User } from "../../graphql/types/graphql"
import DeletePost from "./DeletePost"
import LikeButton from "../Like/LikeButton"
import { RxDotsHorizontal } from 'react-icons/rx'
import { IconContext } from "react-icons"
import { useState } from "react"
import PostImage from "./PostImage"

interface IProps {
  postId: string,
  currentUser: User
}

const PostContent = ({ postId, currentUser }: IProps) => {
  const navigate = useNavigate()
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  const {loading, error, data} = useQuery(GET_POST, {
    variables: { postId }
  })
  if(loading) return null

  const postData = data?.getPost
  if(!isPost(postData)) return <Navigate to='/' />

  const {displayname, username} = postData.poster
  const {content, likesCount, currentUserLike} = postData

  return (
    <div className="postPage">
      <div className="postPage__topContainer">
        <div>
          <p onClick={() => navigate(`/users/${postData.poster.userId}`)} 
             className="postPage__displayname">
              {displayname}
          </p>
          <p className="postPage__username">#{username}</p>
        </div>
        <button onClick={() => setShowOptionsModal(!showOptionsModal)} 
          className="openModalButton">
            <IconContext.Provider value={{style: {display: 'block'}}}>
              <RxDotsHorizontal />
            </IconContext.Provider>
        </button>
      </div>
      {showOptionsModal &&
        <div>
          <div className="modalWrapper" 
            onClick={() => setShowOptionsModal(!showOptionsModal)}>
          </div>
          <div className="optionsModal">
            {currentUser.userId === postData.poster.userId 
              && <DeletePost postId={postId} userId={currentUser.userId}/>}
            <button className="postOptionsButton" 
              onClick={() => console.log('test test test')}>
                test
            </button>
          </div>
        </div>
      }
      <p className="postPage__content">{content}</p>
      {postData.imageUrl && <PostImage imageUrl={postData.imageUrl} />}
      <div className="postPage__date">
        <p>{new Intl.DateTimeFormat('default', {
          hour: 'numeric',
          minute: 'numeric'
        }).format(postData.createdOn)}</p>
        <span className="dotSeparator">·</span>
        <p>{new Intl.DateTimeFormat('default', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(postData.createdOn)}</p>
      </div>
      {likesCount > 0 &&
        <p className="postPage__likesInfo">
          {likesCount} {likesCount > 1 
            ? <span className="postPage__likeWord">Likes</span>
            : <span className="postPage__likeWord">Like</span>}
        </p>
      }
      <div className="postPage__interactButtons">
        <LikeButton 
          likes={likesCount}
          contentId={postId} 
          contentType="post"
          userLiked={currentUserLike ? true : false}
          postType={'page'}
        />
      </div>
    </div>
  )
}

export default PostContent