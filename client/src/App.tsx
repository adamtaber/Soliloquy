import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import User from "./pages/user"
import Post from "./pages/post"
import Messages from "./pages/messages"
import Root from "./components/General/Root"
import Authenticate from "./components/General/Authenticate"
import { useSubscription } from "@apollo/client"
import { MESSAGE_SENT } from "./graphql/messages/subscriptions"

const App = () => {
  const {loading, error, data} = useSubscription(MESSAGE_SENT)
  if(loading) console.log('sub loading...')
  if(error) console.log('error: ', error)
  if(!loading) console.log(data)

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

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
