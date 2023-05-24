import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import User from "./pages/user"
import Post from "./pages/post"
import Messages from "./pages/messages"
import Root from "./components/General/Root"
import Authenticate from "./components/General/Authenticate"
import { useQuery, useSubscription } from "@apollo/client"
import { MESSAGE_SENT } from "./graphql/messages/subscriptions"
import { CURRENT_USER } from "./graphql/users/queries"
import { isUser } from "./graphql/users/types"

const MessageSubscription = (props: {receiverId: string}) => {
  const {receiverId} = props
  console.log(receiverId)
  const {loading, error, data} = useSubscription(MESSAGE_SENT, {
    variables: {receiverId}
  })
  if(loading) console.log('sub loading...')
  if(error) console.log('error: ', error)
  if(!loading) console.log(data)

  return (
    <>
    </>
  )
}

const App = () => {
  const {loading, error, data} = useQuery(CURRENT_USER)
  if(loading) console.log('query loading...')
  if(error) console.log(error)
  
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Authenticate />}>
        <Route index element={<Home />} />
        <Route path="users/:userId" element={<User />} />
        <Route path="posts/:postId" element={<Post />} />
        <Route path="messages" element={<Messages />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
    )
  )

  let currentUserId

  if(data && isUser(data.currentUser)) {
    currentUserId = data.currentUser.userId
  }

  return (
    <>
      {!loading && currentUserId && <MessageSubscription receiverId={currentUserId}/>}
      <RouterProvider router={router} />
    </>
  )
}

export default App
