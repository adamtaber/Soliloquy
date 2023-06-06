import { useQuery } from "@apollo/client"
import { GET_FEED_POSTS } from "../graphql/posts/queries"
import { isPostArray } from "../graphql/posts/types"
import PostForm from "../components/Post/PostForm"
import { CURRENT_USER } from "../graphql/users/queries"
import { isUser } from "../graphql/users/types"
import PostFeed from "../components/Post/PostFeed"

const Home = () => {
  const userQuery = useQuery(CURRENT_USER)
  if(userQuery.loading) return null
  if(userQuery.error) console.log(userQuery.error)
  if(!userQuery.data?.currentUser || !isUser(userQuery.data.currentUser)) {
    console.log('did not retrieve user')
    return null
  }

  const userId = userQuery.data.currentUser.userId

  const postsQuery = useQuery(GET_FEED_POSTS, {
    variables: {limit: 30}
  })
  if(postsQuery.loading) return null
  if(postsQuery.error) console.log(postsQuery.error)
  if(!postsQuery.data?.getFeedPosts || !isPostArray(postsQuery.data.getFeedPosts)) {
    console.log('did not retrieve posts')
    return null
  }

  const postData = postsQuery.data.getFeedPosts

  return (
    <div className="home">
      <div className="home__postForm">
        <PostForm userId={userId}/>
      </div>
      <div className="home__postFeed">
        <PostFeed 
          postData={postData}
          onLoadMore={(lastPostId, lastCreatedOn) => postsQuery.fetchMore({
            variables: {
              lastPostId,
              lastCreatedOn
            },
            updateQuery: (prevRes, {fetchMoreResult}) => {
              const newFeed = fetchMoreResult.getFeedPosts
              const result = newFeed.length
                ? [...prevRes.getFeedPosts, ...newFeed]
                : prevRes.getFeedPosts
              return {
                getFeedPosts: result
              }
            }
          })}/>
      </div>
    </div>
  )
}

export default Home