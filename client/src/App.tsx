import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import User from "./pages/user"
import Post from "./pages/post"
import Root from "./pages/root"
import { useQuery } from "@apollo/client"
import { currentUser } from "./graphql/users/queries"
import Loader from "./pages/loader"
import Authenticate from "./components/Authenticate"

const App = () => {
  const { loading, data, error } = useQuery(currentUser)

  if(loading) {
    return <Loader />
  }

  console.log(data)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={
          <Authenticate>
            <Home />
          </Authenticate>
        } />
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
