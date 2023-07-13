import { useNavigate } from "react-router-dom"
import { Post } from "../../graphql/types/graphql"
import { useEffect, useRef, useState } from "react"
import PostFeedContent from "./PostFeedContent"
import { createImgArray, loadImage } from "../../helpers/helper"

interface IProps {
  postData: Array<Post>,
  onLoadMore: (arg1: String, arg2: String) => void,
}

const PostFeed = ({ postData, onLoadMore }: IProps) => {
  const navigate = useNavigate()
  const observer = useRef<any>()
  const [contentLoaded, setContentLoaded] = useState(false)
  const [loadingPoint, setLoadingPoint] = useState(0)
  
  const lastPostRef = (node: any) => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const lastPostId = postData[postData.length - 1].postId
        const lastCreatedOn = postData[postData.length - 1].createdOn
        onLoadMore(lastPostId, lastCreatedOn)
      }
    })
    if (node) observer.current.observe(node)
  }

  useEffect(() => {
    setContentLoaded(false) 
    const imgArray = createImgArray(postData, loadingPoint)

    if (imgArray.length) {
      Promise.all(imgArray.map((image) => loadImage(image)))
        .then(() => {
          setContentLoaded(true)
          setLoadingPoint(postData.length)
        })
        .catch((err) => console.log('Failed to load images', err))
    } else {
      setContentLoaded(true)
    }
  }, [postData.length])

  return (
    <div>
      {postData.map((post, i) => {
        return (
          <div
            className="home__post"
            onClick={() => navigate(`/posts/${post.postId}`)}
            ref={postData.length === i + 1 ? lastPostRef : null}
            key={post.postId}
            style={{ visibility: contentLoaded || i < loadingPoint 
              ? 'visible' 
              : 'hidden' }}
          >
            <PostFeedContent post={post}/>
          </div>
        )
      })}
    </div>
  )
}

export default PostFeed