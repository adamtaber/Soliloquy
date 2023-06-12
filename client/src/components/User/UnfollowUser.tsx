import { useMutation } from "@apollo/client"
import { UNFOLLOW_USER } from "../../graphql/users/mutations"
import { GET_FOLLOWERS, GET_FOLLOWER_COUNT } from "../../graphql/users/queries"

const UnfollowUser = (props: { userId: string }) => {
  const { userId } = props

  const [unfollowUser, { data, loading, error }] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [
      GET_FOLLOWERS,
      GET_FOLLOWER_COUNT
    ]
  })

  const clickUnfollow = () => {
    unfollowUser({ variables: {userId: userId }})
  }

  return (
    <>
      <button className="unfollowButton" onClick={() => clickUnfollow()}>Unfollow</button>
    </>
  )
}

export default UnfollowUser