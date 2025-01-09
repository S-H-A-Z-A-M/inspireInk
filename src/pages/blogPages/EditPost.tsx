import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "@/components";
import PostForm from "@/components/post-form/PostForm.tsx";
import { blogApi } from "@/axios";

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      blogApi
        .get(`/blog/${slug}`)
        .then((response) =>{
           setPost(response.data.message)});
    } else {
      navigate("/");
    }
  }, [slug, navigate]);
  // console.log(post);
  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
