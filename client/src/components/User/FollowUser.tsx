import { useMutation } from "@apollo/client"
import { FOLLOW_USER } from "../../graphql/users/mutations"
import { GET_FOLLOWERS, GET_FOLLOWER_COUNT, GET_FOLLOWING, GET_FOLLOWING_COUNT } from "../../graphql/users/queries"

const FollowUser = (props: { userId: string, currentUserId: string }) => {
  const { userId, currentUserId } = props

  const [followUser, { data, loading, error }] = useMutation(FOLLOW_USER, {
    refetchQueries: [
      {query: GET_FOLLOWERS, variables: { userId }},
      {query: GET_FOLLOWING, variables: { userId: currentUserId } },
      {query: GET_FOLLOWER_COUNT, variables: { userId }},
      {query: GET_FOLLOWING_COUNT, variables: { userId: currentUserId } }
    ]
  })

  const clickFollow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    followUser({ variables: {followUserId: userId }})
    e.stopPropagation()
  }

  return (
    <>
      <button className="followButton" onClick={(e) => clickFollow(e)}>Follow</button>
    </>
  )
}

export default FollowUser