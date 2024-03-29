import { useQuery } from "@apollo/client"
import { GET_USER_POSTS } from "../../graphql/posts/queries"
import { isPostArray } from "../../graphql/posts/types"
import { Link, Navigate, useNavigate } from "react-router-dom"
import LikeButton from "../Like/LikeButton"
import PostImage from "../Post/PostImage"

const UserPosts = (props: { userId: string } ) => {
  const { userId } = props
  const navigate = useNavigate()

  const {loading, error, data} = useQuery(GET_USER_POSTS, {
    variables: { userId }
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isPostArray(data.getUserPosts)) {
    console.log('missing post data')
    return <Navigate to='/' />
  }

  const postsData = data.getUserPosts.map((post) => {
    let date = new Date(post.createdOn)
    return {
      ...post,
      createdOn: date.toLocaleString()
    }
  })

  return (
    <div className="home__postFeed">
      {postsData.map((post) => {
        return (
          <div className="home__post" 
            onClick={() => navigate(`/posts/${post.postId}`)}
            key={post.postId}>
              <div className="post__topRow">
                  <Link className="post__username" 
                    onClick={(e) => e.stopPropagation()}
                    to={`/users/${post.poster.userId}`}>
                      {post.poster.displayname}
                  </Link>
                <p className="post__date">{post.createdOn}</p>
              </div>
              <p className="post__content">{post.content}</p>
              {post.imageUrl && <PostImage imageUrl={post.imageUrl} />}
              <LikeButton 
                likes={post.likesCount}
                contentId={post.postId} 
                contentType="post"
                userLiked={post.currentUserLike ? true : false}
                postType="feed"
              />
          </div>
        )
      })}
    </div>
  )
}

export default UserPosts