import { useState, useEffect } from "react";
import { Container } from "@/components";
import PostCard from "@/components/container/PostCard";
import { blogApi } from "@/axios";
import TopBar from "@/components/container/TopBar";
import Pagniation from "@/components/container/Pagniation";
import Search from "@/components/container/Search";

function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sorting, setSorting] = useState("latest");
  const [search, setSearch] = useState("");
  useEffect(() => {
    blogApi
      .get("/all-blogs", {
        params: { page: currentPage, sorting: sorting, search: search },
      })
      .then((response) => {
        if (response) {
          const {
            blogs,
            currentPage: resPage,
            totalPages,
          } = response.data.data;
          setPosts(blogs);
          if (resPage !== currentPage) {
            setCurrentPage(resPage);
          }
          setTotalPages(totalPages);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage, sorting, search]);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="md:flex md:items-center md:justify-around md:w-full md:px-[40px] md:mb-4 lg:px-[120px]">
        <TopBar setSorting={setSorting} sorting={sorting} />
        <Search
          setSearch={setSearch}
          search={search}
          setSorting={sorting}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {search !== "" && (
        <div>
          <h1 className="text-2xl text-center mb-4 md:mb-0">
            The results for: <span className="font-bold">{search}</span>
          </h1>
        </div>
      )}
      {/* <AppSidebar /> */}
      <Container>
        <div className="flex flex-col gap-5">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post._id} className="">
                <PostCard {...post} />
              </div>
            ))
          ) : (
            <div className="flex flex-col h-72 items-center justify-center">
              <p className="text-xl font-bold">No blogs found.</p>
              <p>Please try some other keywords or check your spelling.</p>
            </div>
          )}
          <Pagniation
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Container>
    </div>
  );
}

export default Home;
