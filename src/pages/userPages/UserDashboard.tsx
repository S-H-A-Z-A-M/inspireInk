import { blogApi, userApi } from "@/axios";
import AlertDialogSlide from "@/components/container/AlertDialogSlide";
import PostCard from "@/components/container/PostCard";
import UserCard from "@/components/container/UserCard";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UserDashboard() {
  const { username } = useParams();
  const [userPosts, setUserPost] = useState([]);
  const [user, setUser] = useState(null);
  const isUserPage = useRef(true);
  const naviagte = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (username) {
          const userData = await userApi.get(`/get-user/${username}`);
          const userPostData = await userApi.get(`/all-user-blogs/${username}`);
          if (userData) {
            setUser(userData.data.data);
          }
          if (userPostData) {
            setUserPost(userPostData.data.message);
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, [username]);

  const handleEdit = async (slugToEdit) => {
    // console.log(slugToEdit);
    naviagte(`/edit-post/${slugToEdit}`);
  };

  const handleDelete = async (slugToDelete) => {
    // try {
    //   const response = await blogApi.delete(`/delete-blog/:slug`);
    // } catch (error) {
    //   console.log(error);
    // }
    console.log(slugToDelete);
  };

  return user && userPosts ? (
    <div>
      <UserCard user={user} />
      {userPosts.map((userPost) => (
        <div key={userPost._id} className="">
          <PostCard
            {...userPost}
            isuserPage={isUserPage}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>
      ))}
    </div>
  ) : null;
}

export default UserDashboard;
