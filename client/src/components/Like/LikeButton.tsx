import { VscHeartFilled, VscHeart } from 'react-icons/vsc'
import { IconContext } from 'react-icons'
import { useMutation } from "@apollo/client"
import { DELETE_LIKE, LIKE_CONTENT } from "../../graphql/likes/mutations"
import { GET_POST } from "../../graphql/posts/queries"
import { Post } from "../../graphql/types/graphql"

const LikeButton = 
  (props: { likes: number, contentId: string, 
    contentType: string, userLiked: boolean, postType: string }) => {

  const {likes, contentId, contentType, userLiked, postType} = props

  const [likeContent, likeResults] = useMutation(LIKE_CONTENT, {
    variables: (contentType === 'post' 
      ? {postId: contentId} 
      : {commentId: contentId}),
    refetchQueries: [
      {query: GET_POST, variables: {postId: contentId}}
    ],
    update(cache) {
      cache.modify({
        fields: {
          getFeedPosts(existingPosts = []) {
            return existingPosts.map((post: Post) => {
              if(contentType === 'post' && post.postId === contentId) {
                let likesCount = post.likesCount + 1
                return {...post, likesCount, currentUserLike: true}
              } else return post
            })
          },
          getUserPosts(existingPosts = []) {
            return existingPosts.map((post: Post) => {
              if(post.postId === contentId) {
                let likesCount = post.likesCount + 1
                return {...post, likesCount, currentUserLike: true}
              } else return post
            })
          }
        }
      })
    }
  })

  const [unlikeContent, unlikeResults] = useMutation(DELETE_LIKE, {
    variables: (contentType === 'post' 
      ? {postId: contentId} 
      : {commentId: contentId}),
    refetchQueries: [
      {query: GET_POST, variables: {postId: contentId}}
    ], 
    update(cache) {
      cache.modify({
        fields: {
          getFeedPosts(existingPosts = []) {
            return existingPosts.map((post: Post) => {
              if(contentType === 'post' && post.postId === contentId) {
                let likesCount = post.likesCount - 1
                return {...post, likesCount, currentUserLike: null}
              } else return post
            })
          },
          getUserPosts(existingPosts = []) {
            return existingPosts.map((post: Post) => {
              if(post.postId === contentId) {
                let likesCount = post.likesCount - 1
                return {...post, likesCount, currentUserLike: null}
              } else return post
            })
          }
        }
      })
    }
  })

  const clickLike = 
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation()
      if(!userLiked) likeContent()
      else unlikeContent()
  }

  if (postType === 'page') return (
    <div>
      <button className={userLiked ? 'dislikeButtonPage' : 'likeButtonPage'} 
        onClick={(e) => clickLike(e)}>
          {userLiked 
          ? <IconContext.Provider value={{style: {display: 'block'}}}>
              <VscHeartFilled/>
            </IconContext.Provider>
          : <IconContext.Provider value={{style: {display: 'block'}}}>
              <VscHeart />
            </IconContext.Provider>
          } 
      </button> 
    </div>
  )

  return (
    <div className='post__likes'>
      <button className={userLiked ? 'dislikeButton' : 'likeButton'} 
        onClick={(e) => clickLike(e)}>
          {userLiked 
          ? <IconContext.Provider value={{style: {display: 'block'}}}>
              <VscHeartFilled/>
            </IconContext.Provider>
          : <IconContext.Provider value={{style: {display: 'block'}}}>
              <VscHeart />
            </IconContext.Provider>
          } 
          <p className='likeCount'>{likes}</p>
      </button> 
    </div>
  )
}

export default LikeButton