import { useMutation } from "@apollo/client"
import { FOLLOW_USER } from "../../graphql/users/mutations"
import { GET_FOLLOWERS, GET_FOLLOWER_COUNT } from "../../graphql/users/queries"

const FollowUser = (props: { userId: string }) => {
  const { userId } = props

  const [followUser, { data, loading, error }] = useMutation(FOLLOW_USER, {
    refetchQueries: [
      GET_FOLLOWERS,
      GET_FOLLOWER_COUNT
    ]
  })

  const clickFollow = () => {
    followUser({ variables: {followUserId: userId }})
  }

  return (
    <>
      <button className="followButton" onClick={() => clickFollow()}>Follow</button>
    </>
  )
}

export default FollowUser