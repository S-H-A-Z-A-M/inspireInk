import { useState } from "react";
import { Input } from "../ui/input";
import { Search as Icon, X } from "lucide-react";
const Search = ({ setSearch, search, setSorting, setCurrentPage }: any) => {
  const handleClose = () => {
    setSearch("");
    setCurrentPage(1);
    setTempSearch("");
    setSorting("latest");
  };

  const [tempSearch, setTempSearch] = useState(search);
  return (
    <div className="flex none items-center gap-2 bg-[#eee] p-1 px-2 rounded-full mb-4 md:mb-0">
      <Icon />
      <Input
        type="text"
        placeholder="Search..."
        className="!border-none !ring-0 !focus:ring-0 !focus:outline-none !shadow-none w-[12rem] md:w-[16rem]"
        value={tempSearch}
        onChange={(e) => {
          setTempSearch(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearch(tempSearch);
          }
        }}
      />
      {search !== "" && <X onClick={handleClose} />}
    </div>
  );
};

export default Search;
