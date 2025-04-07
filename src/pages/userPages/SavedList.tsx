import { userApi } from "@/axios";
import PostCard from "@/components/container/PostCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Post {
  _id: string;
  title: string;
  content: string;
  slug: string;
  // Add other post-related properties here
}
const SavedList = () => {
  const { username } = useParams();
  const [userPosts, setUserPost] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (username) {
          const userPostData = await userApi.get(
            `/all-saved-blogs/${username}`
          );
          if (userPostData) {
            setUserPost(userPostData.data.message);
          }
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, [username]);

  return userPosts.length > 0 ? (
    <div>
        <div className="mb-4 flex flex-col gap-2 w-full items-center">
            <h1 className="text-3xl font-bold">Saved Blogs</h1>
            <p className="text-gray-500">All your saved blogs are here.</p>
        </div>
      {userPosts.map((userPost) => (
        <div key={userPost._id} className="">
          <PostCard {...userPost} />
        </div>
      ))}
    </div>
  ) : (
    <div>null</div>
  );
};

export default SavedList;
