import { useState, useEffect } from "react";
import { Container } from "@/components";
import PostCard from "@/components/container/PostCard";
import { blogApi } from "@/axios";
import TopBar from "@/components/container/TopBar";
import Pagniation from "@/components/container/Pagniation";
import Search from "@/components/container/Search";

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
      <div className="md:flex md:items-center md:justify-around md:w-full md:px-[40px] md:mb-4 lg:px-[120px]">
        <TopBar setPosts={setPosts} posts={posts} />
        <Search />
      </div>
      {/* <AppSidebar /> */}
      <Container>
        <div className="flex flex-col gap-5">
          {posts.map((post: any) => (
            <div key={post._id} className="">
              <PostCard {...post} />
            </div>
          ))}
          <Pagniation />
        </div>
      </Container>
    </div>
  );
}

export default Home;
