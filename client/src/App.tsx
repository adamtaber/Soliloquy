import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useParams } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import User from "./pages/user"
import Post from "./pages/post"
import Messages from "./pages/messages"
import Root from "./components/General/Root"
import Authenticate from "./components/General/Authenticate"
import Followers from "./components/User/Followers"
import Following from "./components/User/Following"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Authenticate />}>
        <Route index element={<Home />} />
        <Route path="users/:userId" element={<User />} />
        <Route path="posts/:postId" element={<Post />} />
        <Route path="posts/:postId/comments/:commentId" element={<Post />} />
        <Route path="users/:userId/followers" element={<Followers />} />
        <Route path="users/:userId/following" element={<Following />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:userId" element={<Messages />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
    )
  )

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
