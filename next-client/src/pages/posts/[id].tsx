import { GET_POST } from '@/graphql/posts/queries'
import { currentUser } from '@/graphql/users/queries'
import { addApolloState, initializeApollo } from '@/lib/apolloClient'
import { useQuery } from '@apollo/client'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { id } = router.query

  //check if id corresponds to a valid post
  //if no: redirect to 404
  //if yes: load page content with post data

  return (
    <>
      <p>PostId: {id}</p>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo()

  const loggedIn = await apolloClient.query({
    query: currentUser
  })

  if (!loggedIn) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const id = context?.params?.id

  if (typeof id !== 'string') {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const postContent = await apolloClient.query({
    query: GET_POST,
    variables: {postId: id}
  })

  if (!postContent) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return addApolloState(apolloClient, {
    props: {postContent}
  })
}

export default Post