import { useQuery } from "@apollo/client"
import { GET_FEED_POSTS } from "../graphql/posts/queries"
import { isPostArray } from "../graphql/posts/types"
import { Link } from "react-router-dom"

const Home = () => {
  const postsQuery = useQuery(GET_FEED_POSTS)

  if(postsQuery.loading) return null
  if(postsQuery.error) console.log(postsQuery.error)

  if(!postsQuery.data?.getFeedPosts || !isPostArray(postsQuery.data.getFeedPosts)) {
    console.log('did not retrieve posts')
    return null
  }

  const postsData = postsQuery.data.getFeedPosts.map((post) => {
    let date = new Date(post.createdOn)
    return {
      ...post,
      createdOn: date.toLocaleString()
    }
  })

  return (
    <div>
      <p>HOME</p>
      {postsData.map((post) => {
        return (
          <p key={post.postId}>
            user: <Link to={`/users/${post.userId}`}>{post.displayname}</Link>
            content: {post.content}  
            date: {post.createdOn}
          </p>
        )
      })}
    </div>
  )
}

export default Home