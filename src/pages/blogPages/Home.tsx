import { useState, useEffect } from "react";
import { Container } from "@/components";
import PostCard from "@/components/container/PostCard";
import { blogApi } from "@/axios";
import TopBar from "@/components/container/TopBar";

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
    <div className="w-full flex flex-col items-center">
      <TopBar setPosts={setPosts} posts={posts} />
      {/* <AppSidebar /> */}
      <Container>
        <div className="flex flex-col gap-5">
          {posts.map((post: any) => (
            <div key={post._id} className="">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
