import { Separator } from "@radix-ui/react-separator";

function topBar({ setSorting }: any) {
  return (
    <div className=" self-center mb-4 md:mb-0 lg:self-auto">
      <ul className="flex gap-4 lg:gap-10 text-lg">
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={() => setSorting("comments")}>
          <li>Engaged</li>
        </button>
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={() => setSorting("likes")}>
          <li>Popular</li>
        </button>
        <Separator className="border border-pink-600" orientation="vertical" />
        <button onClick={() => setSorting("latest")}>
          <li>Latest</li>
        </button>
      </ul>
    </div>
  );
}

export default topBar;
