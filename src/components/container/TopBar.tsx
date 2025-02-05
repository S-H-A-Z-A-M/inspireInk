import { Separator } from "@radix-ui/react-separator";

function topBar({ setPosts, posts }: any) {
  const sortBlogs = (criterion: string) => {
    const sortedBlogs = [...posts].sort(
      (a, b) => b[criterion].length - a[criterion].length
    );
    setPosts(sortedBlogs); // Update state with sorted blogs
  };
  const sortByNewest = () => {
    const sortedBlogs = [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(sortedBlogs);
  };
  return (
    <div className=" self-center mb-6">
      <ul className="flex gap-4 text-lg">
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={() => sortBlogs("commentedBy")}>
          <li>Engaged</li>
        </button>
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={() => sortBlogs("likedBy")}>
          <li>Popular</li>
        </button>
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={sortByNewest}>
          <li>Latest</li>
        </button>
      </ul>
    </div>
  );
}

export default topBar;
