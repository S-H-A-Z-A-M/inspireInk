import { useState, useEffect } from "react";
import { Container } from "@/components";
import PostCard from "@/components/container/PostCard";
import { blogApi } from "@/axios";
import Dropdown from "@/components/container/Dropdown";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    blogApi.get("/all-blogs").then((response) => {
      if (response) {
        setPosts(response.data.data.blogs);
      }
    });
  }, []);
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post._id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
          {/* <Dropdown/> */}
        </div>
      </Container>
    </div>
  );
}

export default Home;
