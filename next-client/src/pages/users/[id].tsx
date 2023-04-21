import { useRouter } from 'next/router'

const User = () => {
  const router = useRouter()
  const { id } = router.query

  //check if id corresponds to a valid user
  //if no: redirect to 404
  //if yes: load page content with post data

  return (
    <>
      <p>UserId: {id}</p>
    </>
  )
}

export default User