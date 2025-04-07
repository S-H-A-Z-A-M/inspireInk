import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "@/components";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { blogApi, userApi } from "@/axios";
import CommentSection from "@/components/comments/CommentSection";
import SideBar from "@/components/container/SideBar";
import { login } from "@/store/authSlice";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-markup";

type postSchema = {
  _id: string;
  coverImage: string;
  content: string;
  title: string;
};

function Post() {
  const [post, setPost] = useState<postSchema | null>(null);
  const slug = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.auth.userData);
  const [noOfComments, setNoOfComments] = useState(0);
  const [likesArray, setLikesArray] = useState([]);
  const [userSavedArray, setUserSavedArray] = useState(
    userData ? userData.savedList : []
  );

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
      if (!post) {
        return;
      }
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
          Prism.highlightAll();
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);
  return post ? (
    <div className="lg:py-8">
      <Container>
        <div className="lg:flex justify-center">
          <SideBar
            noOfComment={noOfComments}
            likesArray={likesArray}
            userSavedArray={userSavedArray}
            handleLike={handleLike}
            handleSave={handleSave}
            postId={post._id}
          />

          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 lg:p-2">
            <div className="rounded-lg bg-white  p-6 max-w-4xl w-full">
              {/* Image Section */}
              <div className="w-full flex justify-center mb-12 border">
                <img
                  className="rounded-xl h-[350px] w-[350px] object-contain lg:h-auto lg:max-h-[400px] lg:w-[700px]"
                  src={post.coverImage}
                  alt="Post Cover"
                />
              </div>

              {/* Title and Content Section */}
              <div>
                {/* Title */}
                <h1 className="text-2xl mb-2 lg:text-4xl font-bold lg:text-justify lg:mb-6 lg:px-12">
                  {post.title}
                </h1>

                {/* Content */}
                <div className="text-lg lg:text-justify px-1 lg:px-6 post-content prose prose-sm sm:prose lg:prose-lg max-w-none mx-auto">
                  {parse(post.content)}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-4 lg:mt-8">
                <CommentSection
                  updateComment={(data: any) => setNoOfComments(data)}
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
