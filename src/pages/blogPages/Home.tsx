import { useState, useEffect } from "react";
import { Container } from "@/components";
import PostCard from "@/components/container/PostCard";
import { blogApi } from "@/axios";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/container/AppSidebar";

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
    <div className="w-full relative justify-center">
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
