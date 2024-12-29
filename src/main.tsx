import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Protected from "./components/Layout/AuthLayout.tsx";
import Signup from "./pages/Signup.tsx";
import EditPost from "./pages/EditPost.tsx";
import AddPost from "./pages/AddPost.tsx";
import Post from "./pages/Post.tsx";

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
        path: "/all-posts",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <Protected authentication={false} >
            <Login />
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false} >
            <Signup />
          </Protected>
        ),
      },
      {
        path: "/add-post",
        element: (
          <Protected authentication={true} >
            <AddPost />
          </Protected>
        ),
      },
      {
        path:'/edit-post/:slug',
        element:(
          <Protected authentication={true}>
            <EditPost/>
          </Protected>
        )
      },
      {
        path:'/blog/:slug',
        element:(
          <Protected authentication={false}>
            <Post/>
          </Protected>
        )
      }
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
