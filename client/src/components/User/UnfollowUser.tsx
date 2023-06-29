import { useMutation } from "@apollo/client"
import { UNFOLLOW_USER } from "../../graphql/users/mutations"
import { GET_FOLLOWERS, GET_FOLLOWER_COUNT, GET_FOLLOWING, GET_FOLLOWING_COUNT } from "../../graphql/users/queries"

const UnfollowUser = (props: { userId: string, currentUserId: string }) => {
  const { userId, currentUserId } = props

  const [unfollowUser, { data, loading, error }] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [
      {query: GET_FOLLOWING_COUNT, variables: { userId: currentUserId }},
      {query: GET_FOLLOWERS, variables: { userId }},
      {query: GET_FOLLOWING, variables: { userId: currentUserId } },
      {query: GET_FOLLOWER_COUNT, variables: { userId }},
    ]
  })

  const clickUnfollow = 
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      unfollowUser({ variables: {userId: userId }})
      e.stopPropagation()
  }

  return (
    <>
      <button className="unfollowButton" onClick={(e) => clickUnfollow(e)}>Unfollow</button>
    </>
  )
}

export default UnfollowUser