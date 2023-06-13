import { useQuery } from "@apollo/client"
import { GET_POST } from "../../graphql/posts/queries"
import { isPost } from "../../graphql/posts/types"
import { Navigate } from "react-router-dom"
import { User } from "../../graphql/types/graphql"
import DeletePost from "./DeletePost"
import LikeButton from "../Like/LikeButton"
import { RxDotsHorizontal } from 'react-icons/rx'
import { IconContext } from "react-icons"
import { useState } from "react"

const PostContent = (params: {postId: string, currentUser: User}) => {
  const { postId, currentUser } = params
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  const {loading, error, data} = useQuery(GET_POST, {
    variables: { postId }
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isPost(data.getPost)) {
    console.log('invalid post')
    return <Navigate to='/' />
  }

  const postData = data.getPost
  const createDate = new Date(postData.createdOn)

  return (
    <div className="postPage">
      <div className="postPage__topContainer">
        <div>
          <p className="postPage__displayname">{postData.poster.displayname}</p>
          <p className="postPage__username">#{postData.poster.username}</p>
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
      <p className="postPage__content">{postData.content}</p>
      <p className="postPage__date">{createDate.toLocaleDateString()}</p>
      {postData.likesCount > 0 &&
        <p className="postPage__likesInfo">
          {postData.likesCount} {postData.likesCount > 1 
            ? <span className="postPage__likeWord">Likes</span>
            : <span className="postPage__likeWord">Like</span>}
        </p>
      }
      <div className="postPage__interactButtons">
        <LikeButton 
          likes={postData.likesCount}
          contentId={postData.postId} 
          contentType="post"
          userLiked={postData.currentUserLike ? true : false}
          postType={'page'}
        />
      </div>
    </div>
  )
}

export default PostContent