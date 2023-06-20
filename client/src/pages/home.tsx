import { useQuery } from "@apollo/client"
import { GET_FEED_POSTS } from "../graphql/posts/queries"
import { isPostArray } from "../graphql/posts/types"
import PostForm from "../components/Post/PostForm"
import { CURRENT_USER } from "../graphql/users/queries"
import { isUser } from "../graphql/users/types"
import PostFeed from "../components/Post/PostFeed"

const Home = () => {
  const userQuery = useQuery(CURRENT_USER)
  const userId = userQuery.data?.currentUser && isUser(userQuery.data.currentUser)
    ? userQuery.data.currentUser.userId
    : ''

  const postsQuery = useQuery(GET_FEED_POSTS, {
    variables: {limit: 30}
  })
  const postData = 
    postsQuery.data?.getFeedPosts && isPostArray(postsQuery.data.getFeedPosts)
      ? postsQuery.data.getFeedPosts
      : ''

  return (
    <div className="home">
      <div className="home__postFormContainer">
        <PostForm userId={userId}/>
      </div>
      <div className="home__postFeed">
        { 
          postData &&
          <PostFeed 
            postData={postData}
            onLoadMore={(lastPostId, lastCreatedOn) => postsQuery.fetchMore({
              variables: {
                lastPostId,
                lastCreatedOn
              },
              updateQuery: (prevRes, {fetchMoreResult}) => {
                console.log(fetchMoreResult)
                const newFeed = fetchMoreResult.getFeedPosts
                const result = newFeed.length
                  ? [...prevRes.getFeedPosts, ...newFeed]
                  : prevRes.getFeedPosts
                return {
                  getFeedPosts: result
                }
              }
          })}/>
        }
      </div>
    </div>
  )
}

export default Home