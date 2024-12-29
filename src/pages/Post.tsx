import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/container/Button";
import { Container } from "@/components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Post() {
  const [post, setPost] = useState(null);
  const slug = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.owner === userData._id : false;

  const deletePost = () => {
    useEffect(() => {
      // write axios method to delete post
      // handle the error with try and cath
      // after the post is deleted use .then to delete images
    });
  };

  useEffect(() => {
    if (slug) {
      // axios method to get the certain post using slug
      // then setPost(post);
      // else{naviagte("/")}
    }
  }, [slug, navigate]);

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img src={post.coverImage} alt="" />
        </div>
        <div>
          <div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
          </div>
          <div className="browser-css">{parse(post.content)}</div>
        </div>
      </Container>
    </div>
  ) : null;
}

export default Post;
