import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/blogPages/Home.tsx";
import Login from "./pages/userPages/Login.tsx";
import Protected from "./components/Layout/AuthLayout.tsx";
import Signup from "./pages/userPages/Signup.tsx";
import EditPost from "./pages/blogPages/EditPost.tsx";
import AddPost from "./pages/blogPages/AddPost.tsx";
import Post from "./pages/blogPages/Post.tsx";
import UserDashboard from "./pages/userPages/UserDashboard.tsx";
import EditUserPage from "./pages/userPages/EditUserPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <Signup />
          </Protected>
        ),
      },
      {
        path: "/add-post",
        element: (
          <Protected authentication={true}>
            <AddPost />
          </Protected>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <Protected authentication={true}>
            <EditPost />
          </Protected>
        ),
      },
      {
        path: "/blog/:slug",
        element: (
          <Protected authentication={false}>
            <Post />
          </Protected>
        ),
      },
      {
        path: "/users/:username",
        element: (
          <Protected authentication={false}>
            <UserDashboard />
          </Protected>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <Protected authentication={true}>
            <EditUserPage />
          </Protected>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
