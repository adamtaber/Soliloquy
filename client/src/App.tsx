import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import User from "./pages/user"
import Post from "./pages/post"
import Root from "./pages/root"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="users/:userId" element={<User />} />
        <Route path="posts/:postId" element={<Post />} />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App