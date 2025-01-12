import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/container/Button";
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
        console.log(response);
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
          <div>
            <div className="rounded-sm p-2">
              <div className="w-full flex mb-4 relative border rounded-xl">
                <img className="rounded-xl" src={post.coverImage} alt="" />
              </div>
              <div className="">
                <div>
                  <h1 className="text-5xl font-bold mb-2">{post.title}</h1>
                </div>
                <div className="browser-css px-10">{parse(post.content)}</div>
              </div>
            </div>
            <CommentSection
              updateComment={(data) => setNoOfComments(data)}
              id="commentSection"
              postId={post._id}
            />
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}

export default Post;
