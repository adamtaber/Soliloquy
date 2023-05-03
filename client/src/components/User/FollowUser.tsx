import { useMutation } from "@apollo/client"
import { FOLLOW_USER } from "../../graphql/users/mutations"
import { GET_FOLLOWERS } from "../../graphql/users/queries"

const FollowUser = (props: { userId: string }) => {
  const { userId } = props

  const [followUser, { data, loading, error }] = useMutation(FOLLOW_USER, {
    refetchQueries: [
      GET_FOLLOWERS
    ]
  })

  if(loading) console.log('loading...')
  if(error) console.log(error)

  const clickFollow = () => {
    followUser({ variables: {followUserId: userId }})
  }

  return (
    <>
      <button onClick={() => clickFollow()}>Follow</button>
    </>
  )
}

export default FollowUser