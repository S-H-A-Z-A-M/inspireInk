import { Input } from "../ui/input";
import { Search as Icon } from "lucide-react";
const Search = ({ setSearch }: any) => {
  return (
    <div className="flex none items-center gap-2 bg-[#eee] p-1 px-2 rounded-full mb-4 md:mb-0">
      <Icon />
      <Input
        type="text"
        placeholder="Search..."
        className="!border-none !ring-0 !focus:ring-0 !focus:outline-none !shadow-none w-[12rem] md:w-[16rem]"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearch(e.currentTarget.value);;
          }
        }}
      />
    </div>
  );
};

export default Search;
