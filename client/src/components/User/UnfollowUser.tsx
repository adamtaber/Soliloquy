import { useMutation } from "@apollo/client"
import { UNFOLLOW_USER } from "../../graphql/users/mutations"
import { GET_FOLLOWERS } from "../../graphql/users/queries"

const UnfollowUser = (props: { userId: string }) => {
  const { userId } = props

  const [unfollowUser, { data, loading, error }] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [
      GET_FOLLOWERS
    ]
  })

  if(loading) console.log('loading...')
  if(error) console.log(error)

  const clickUnfollow = () => {
    unfollowUser({ variables: {userId: userId }})
  }

  return (
    <>
      <button onClick={() => clickUnfollow()}>Unfollow</button>
    </>
  )
}

export default UnfollowUser