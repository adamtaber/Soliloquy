import { Link } from "react-router-dom"
import { Post } from "../../graphql/types/graphql"
import { useRef } from "react"

const PostFeed = (props: { postData: Array<Post>, onLoadMore: (lastPostId: String, lastCreatedOn: Date) => void }) => {
  const {postData, onLoadMore} = props

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
    return {
      ...post,
      createdOn: date.toLocaleString()
    }
  })
  
  return (
    <>
      {feed.map((post, i) => {
        if(feed.length === i + 1) {
          return (
            <p ref={lastPostRef} key={post.postId}>
              user: <Link to={`/users/${post.userId}`}>{post.displayname}</Link>
              content: {post.content}  
              date: {post.createdOn}
            </p>
          )
        } 
        return (
          <p key={post.postId}>
            user: <Link to={`/users/${post.userId}`}>{post.displayname}</Link>
            content: {post.content}  
            date: {post.createdOn}
          </p>
        )
      })}
    </>
  )
}

export default PostFeed