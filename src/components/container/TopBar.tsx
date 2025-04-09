import { Separator } from "@radix-ui/react-separator";

function topBar({ setSorting, sorting }: any) {
  return (
    <div className=" self-center mb-4 md:mb-0 lg:self-auto font-semibold">
      <ul className="flex gap-4 lg:gap-10 text-lg">
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={() => setSorting("comments")}>
          <li
            className={sorting === "comments" ? `font-light ` : "font-semibold"}
          >
            Engaged
          </li>
        </button>
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={() => setSorting("likes")}>
          <li className={sorting === "likes" ? `font-light ` : "font-semibold"}>
            Popular
          </li>
        </button>
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={() => setSorting("latest")}>
          <li
            className={sorting === "latest" ? `font-light ` : "font-semibold"}
          >
            Latest
          </li>
        </button>
      </ul>
    </div>
  );
}

export default topBar;
