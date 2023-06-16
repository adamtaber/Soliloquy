import { useMutation } from "@apollo/client"
import { DELETE_LIKE, LIKE_CONTENT } from "../../graphql/likes/mutations"
import { GET_CHILD_COMMENTS } from "../../graphql/comments/queries"
import { IconContext } from "react-icons"
import { VscHeart, VscHeartFilled } from "react-icons/vsc"
import { Comment } from "../../graphql/types/graphql"

interface IProps {
  comment: Comment
}

const LikeCommentButton = ({ comment }: IProps) => {
  const { commentId, likesCount, currentUserLike } = comment

  const [likeContent, likeResults] = useMutation(LIKE_CONTENT, {
    variables: { commentId },
    update(cache) {
      cache.modify({
        fields: {
          getChildComments(existingComments = []) {
            return existingComments.map((comment: Comment) => {
              if(comment.commentId === commentId) {
                let likesCount = comment.likesCount + 1
                return {...comment, likesCount, currentUserLike: true}
              } else return comment
            })
          },
          getComments(existingComments = []) {
            return existingComments.map((comment: Comment) => {
              if(comment.commentId === commentId) {
                let likesCount = comment.likesCount + 1
                return {...comment, likesCount, currentUserLike: true}
              } else return comment
            })
          }
        }
      })
    }
  })

  const [unlikeContent, unlikeResults] = useMutation(DELETE_LIKE, {
    variables: { commentId },
    update(cache) {
      cache.modify({
        fields: {
          getChildComments(existingComments = []) {
            return existingComments.map((comment: Comment) => {
              if(comment.commentId === commentId) {
                let likesCount = comment.likesCount - 1
                return {...comment, likesCount, currentUserLike: null}
              } else return comment
            })
          },
          getComments(existingComments = []) {
            return existingComments.map((comment: Comment) => {
              if(comment.commentId === commentId) {
                let likesCount = comment.likesCount - 1
                return {...comment, likesCount, currentUserLike: null}
              } else return comment
            })
          }
        }
      })
    }
  })

  const clickLike = 
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation()
      if(!currentUserLike) likeContent()
      else unlikeContent()
  }

  return (
    <div className='post__likes'>
      <button className={currentUserLike ? 'dislikeButton' : 'likeButton'} 
        onClick={(e) => clickLike(e)}>
          {currentUserLike 
          ? <IconContext.Provider value={{style: {display: 'block'}}}>
              <VscHeartFilled/>
            </IconContext.Provider>
          : <IconContext.Provider value={{style: {display: 'block'}}}>
              <VscHeart />
            </IconContext.Provider>
          } 
          <p className='likeCount'>{likesCount}</p>
      </button> 
    </div>
  )
}

export default LikeCommentButton