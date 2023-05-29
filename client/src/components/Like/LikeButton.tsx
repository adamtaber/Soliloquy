import { useMutation } from "@apollo/client"
import { DELETE_LIKE, LIKE_CONTENT } from "../../graphql/likes/mutations"
import { GET_FEED_POSTS } from "../../graphql/posts/queries"

const LikeButton = (props: {likes: number, contentId: string, contentType: string, userLiked: boolean }) => {
  const {likes, contentId, contentType, userLiked} = props

  const [likeContent, likeResults] = useMutation(LIKE_CONTENT, {
    variables: (contentType === 'post' 
      ? {postId: contentId} 
      : {commentId: contentId}),
    refetchQueries: [
      {query: GET_FEED_POSTS, variables: {limit: 30}}
    ]
  })

  const [unlikeContent, unlikeResults] = useMutation(DELETE_LIKE, {
    variables: (contentType === 'post' 
      ? {postId: contentId} 
      : {commentId: contentId}),
    refetchQueries: [
      {query: GET_FEED_POSTS, variables: {limit: 30}}
    ]
  })

  const clickLike = () => {
    if(!userLiked) likeContent()
    else unlikeContent()
  }

  return (
    <div>
      <button onClick={() => clickLike()}> [{likes}] {userLiked ? 'unlike' : 'like'}</button>
    </div>
  )
}

export default LikeButton