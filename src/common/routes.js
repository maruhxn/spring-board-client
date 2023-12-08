import { createBrowserRouter } from "react-router-dom";
import MemberDetail from "../pages/members/MemberDetail";
import MemberUpdate from "../pages/members/MemberUpdate";
import PasswordUpdate from "../pages/members/PasswordUpdate";
import PostDetail from "../pages/posts/PostDetail";
import PostUpdate from "../pages/posts/PostUpdate";
import PostCreate from "../pages/posts/PostCreate";
import Main from "../pages/main/Main";
import Layout from "../layouts/Layout";
import NotFound from "../pages/NotFound";
import {
  AUTH_PATH,
  MAIN_PATH,
  POST_CREATE_PATH,
  POST_DETAIL_PATH,
  POST_PATH,
  POST_UPDATE_PATH,
  MEMBER_CHANGE_PASSWORD_PATH,
  MEMBER_DETAIL_PATH,
  MEMBER_PATH,
  MEMBER_UPDATE_PATH,
} from "./constants";
import Auth from "../pages/auth/Auth";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: MAIN_PATH(),
        element: <Main />,
      },
      {
        path: AUTH_PATH(),
        element: <Auth />,
      },
      {
        path: MEMBER_PATH(),
        children: [
          {
            path: MEMBER_DETAIL_PATH(":memberId"),
            element: <MemberDetail />,
          },
          {
            path: MEMBER_UPDATE_PATH(":memberId"),
            element: <MemberUpdate />,
          },
          {
            path: MEMBER_CHANGE_PASSWORD_PATH(":memberId"),
            element: <PasswordUpdate />,
          },
        ],
      },
      {
        path: POST_PATH(),
        children: [
          {
            path: POST_CREATE_PATH(),
            element: <PostCreate />,
          },
          {
            path: POST_DETAIL_PATH(":postId"),
            element: <PostDetail />,
          },
          {
            path: POST_UPDATE_PATH(":postId"),
            element: <PostUpdate />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;