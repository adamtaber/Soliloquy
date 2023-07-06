import { Link } from "react-router-dom"
import { Post } from "../../graphql/types/graphql"
import PostImage from "./PostImage"
import LikeButton from "../Like/LikeButton"
import { createDate } from "../../helpers/helper"

interface IProps {
  post: Post
}

const PostFeedContent = ({ post }: IProps) => {

  return (
    <>
      <div className='postBodyContainer'>
        <div>
          <div className='postProfilePic' />
        </div>
        <div className='postRightBody'>
          <div className='post__topRow'>
            <Link
              className='post__username'
              onClick={(e) => e.stopPropagation()}
              to={`/users/${post.poster.userId}`}
            >
              {post.poster.displayname}
            </Link>
            {/* <p className='post__date'>{post.createdOn}</p> */}
            <p className="commentUsername">@{post.poster.username}</p>
            <span className="dotSeparator">·</span>
            <p className="commentDate">{createDate(post.createdOn)}</p>
          </div>
          <p className='post__content'>{post.content}</p>
          {post.imageUrl && <PostImage imageUrl={post.imageUrl} />}
          <LikeButton
            likes={post.likesCount}
            contentId={post.postId}
            contentType='post'
            userLiked={post.currentUserLike ? true : false}
            postType='feed'
          />
        </div>
      </div>
    </>
  )
}

export default PostFeedContent