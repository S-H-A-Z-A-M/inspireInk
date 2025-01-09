import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/container/Button";
import { Container } from "@/components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { blogApi, userApi } from "@/axios";
import CommentSection from "@/components/comments/CommentSection";
import SideBar from "@/components/container/SideBar";

function Post() {
  const [post, setPost] = useState(null);
  const slug = useParams();
  const navigate = useNavigate();
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
        console.log(response)
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
      // console.log(response);
      if (response) {
        setUserSavedArray(response.data.data.savedList);
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
  console.log(likesArray);
  return post ? (
    <div className="py-8">
      <Container>
        <SideBar
          noOfComment={noOfComments}
          likesArray={likesArray}
          userSavedArray={userSavedArray}
          handleLike={handleLike}
          handleSave={handleSave}
          postId={post._id}
        />
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img src={post.coverImage} alt="" />
        </div>
        <div>
          <div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
          </div>
          <div className="browser-css">{parse(post.content)}</div>
        </div>
        <CommentSection
          updateComment={(data) => setNoOfComments(data)}
          id="commentSection"
          postId={post._id}
        />
      </Container>
    </div>
  ) : null;
}

export default Post;
