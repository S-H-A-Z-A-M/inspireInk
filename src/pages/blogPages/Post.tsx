import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Container } from "@/components";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { blogApi, userApi } from "@/axios";
import CommentSection from "@/components/comments/CommentSection";
import SideBar from "@/components/container/SideBar";
import { login } from "@/store/authSlice";

function Post() {
  const [post, setPost] = useState(null);
  const slug = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [noOfComments, setNoOfComments] = useState(0);
  const [likesArray, setLikesArray] = useState([]);
  const [userSavedArray, setUserSavedArray] = useState(
    userData ? userData.savedList : []
  );

  const isAuthor = post && userData ? post.owner === userData._id : false;

  const deletePost = () => {
    useEffect(() => {
      try {
        if (slug) {
          blogApi.delete(`/delete-blog/${slug}`).then((response) => {
            if (response) {
              navigate("/");
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  const handleLike = async () => {
    try {
      if (!userData) {
        navigate("/login");
      }
      const response = await blogApi.patch(`/like-blog/${slug.slug}`);
      if (response) {
        setLikesArray(response.data.message.likedBy);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSave = async () => {
    try {
      if (!userData) {
        navigate("/login");
      }
      const response = await userApi.patch(`/save-blog/${post._id}`);
      if (response) {
        setUserSavedArray(response.data.data.savedList);
        dispatch(login(response.data.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (slug) {
      blogApi.get(`/blog/${slug.slug}`).then((response) => {
        if (response) {
          // Debug here
          const postData = response.data.message;
          setPost(postData);
          setLikesArray(postData.likedBy);
          setNoOfComments(postData.commentedBy.length);
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);
  return post ? (
    <div className="py-8">
      <Container>
        <div className="flex justify-center">
          <SideBar
            noOfComment={noOfComments}
            likesArray={likesArray}
            userSavedArray={userSavedArray}
            handleLike={handleLike}
            handleSave={handleSave}
            postId={post._id}
          />
         
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-2">
  <div className="rounded-lg bg-white  p-6 max-w-4xl w-full">
    {/* Image Section */}
    <div className="w-full flex justify-center mb-6">
      <img
        className="rounded-xl max-w-full h-auto object-cover"
        src={post.coverImage}
        alt="Post Cover"
        style={{maxHeight:"700px",maxwidth:"700px"}}
      />
    </div>

    {/* Title and Content Section */}
    <div>
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6">{post.title}</h1>

      {/* Content */}
      <div className="browser-css text-lg text-justify px-6">{parse(post.content)}</div>
    </div>

    {/* Comments Section */}
    <div className="mt-8">
      <CommentSection
        updateComment={(data) => setNoOfComments(data)}
        id="commentSection"
        postId={post._id}
      />
    </div>
  </div>
</div>

        </div>
      </Container>
    </div>
  ) : null;
}

export default Post;
