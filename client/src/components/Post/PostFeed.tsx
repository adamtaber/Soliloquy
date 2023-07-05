import { Link, useNavigate } from "react-router-dom"
import { Post } from "../../graphql/types/graphql"
import { useEffect, useRef, useState } from "react"
import LikeButton from "../Like/LikeButton"
import PostImage from "./PostImage"

const PostFeed = (props: { postData: Array<Post>, onLoadMore: (lastPostId: String, lastCreatedOn: Date) => void }) => {
  const {postData, onLoadMore} = props
  const navigate = useNavigate()
  const observer = useRef<any>()
  const [imageList, setImageList] = useState<Array<string>>([])
  const [contentLoaded, setContentLoaded] = useState(false)
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME


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

  useEffect(() => {
    // setImageList(['mv4uuir63a2gcnhryfoq', 'tz5zd31xkbvnl2z6kqol'])
    const array: string[] = []
    feed.map((post, i) => {
      if(post.imageUrl) {
        array.push(post.imageUrl)
      }
    })
    setImageList([...imageList, ...array])
  }, [feed.length])

  useEffect(() => {
    console.log(imageList)
    const loadImage = (image: string) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image()
        loadImg.src = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${image}`
        loadImg.onload = () => {
          resolve(image)
          // setTimeout(() => {
          //   resolve(image)
          // }, 2000)
          console.log('test test test')
        }
        loadImg.onerror = err => reject(err)
      })
    }
    if(imageList.length) {
      Promise.all(imageList.map((image) => loadImage(image)))
      .then(() => {
        console.log('set to true')
        setContentLoaded(true)
      })
      .catch(err => console.log("Failed to load images", err))
    }
  }, [imageList])

  return (
    <div style={{visibility: contentLoaded ? 'visible' : 'hidden'}}>
    {/* <div style={{visibility: 'hidden'}}> */}
      {/* <img onLoad={(() => setContentLoaded(true))} src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${imageList[0]}`} /> */}
      {/* {imageList.map((image, i) => {
        return (
          <img key={i} src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${image}`} />
        )
      })} */}
      {feed.map((post, i) => {
          return (
            <div className="home__post" 
              onClick={() => navigate(`/posts/${post.postId}`)}
              ref={feed.length === i + 1 ? lastPostRef : null} 
              key={post.postId}>
                <div className="postBodyContainer">
                  <div>
                    <div className={`postProfilePic`}></div>
                  </div>
                  <div className="postRightBody">
                    <div className="post__topRow">
                      <Link className="post__username" 
                        onClick={(e) => e.stopPropagation()}
                        to={`/users/${post.poster.userId}`}>
                          {post.poster.displayname}
                      </Link>
                      <p className="post__date">{post.createdOn}</p>
                    </div>
                    <p className="post__content">{post.content}</p>
                    {post.imageUrl &&
                      <PostImage 
                        imageUrl={post.imageUrl} 
                      />
                    }
                    <LikeButton 
                      likes={post.likesCount}
                      contentId={post.postId} 
                      contentType="post"
                      userLiked={post.currentUserLike ? true : false}
                      postType="feed"
                    />
                  </div>
                </div>
            </div>
          )
      })}
    </div>
  )
}

export default PostFeed