import { Link, useNavigate } from "react-router-dom"
import { Post } from "../../graphql/types/graphql"
import { useRef } from "react"
import LikeButton from "../Like/LikeButton"

const PostFeed = (props: { postData: Array<Post>, onLoadMore: (lastPostId: String, lastCreatedOn: Date) => void }) => {
  const {postData, onLoadMore} = props
  const navigate = useNavigate()
  const observer = useRef<any>()

  const lastPostRef = (node: any) => {
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) {
        const lastPostId = postData[postData.length - 1].postId
        const lastCreatedOn = postData[postData.length - 1].createdOn
        onLoadMore(lastPostId, lastCreatedOn)
      }
    })
    if(node) observer.current.observe(node)
  }

  const feed = postData.map((post) => {
    let date = new Date(post.createdOn)
    return { ...post, createdOn: date.toLocaleString() }
  })
  
  return (
    <>
      {feed.map((post, i) => {
          return (
            <div className="home__post" 
              onClick={() => navigate(`/posts/${post.postId}`)}
              ref={feed.length === i + 1 ? lastPostRef : null} 
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
    </>
  )
}

export default PostFeed