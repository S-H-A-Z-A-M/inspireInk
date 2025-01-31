import { blogApi } from "@/axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { IoBookmarkOutline } from "react-icons/io5";

function SideBar({
  noOfComment,
  likesArray,
  userSavedArray,
  handleLike,
  handleSave,
  postId,
}) {
  const [noOfSaves, setNoOfSaves] = useState<number>(0);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchSavesCount = async () => {
      try {
        const response = await blogApi.get(`/count-blog-saves/${postId}`);
        if (response && response.data) {
          setNoOfSaves(response.data.message); // Set the count properly
        }
      } catch (error) {
        console.error("Error fetching save count:", error);
      }
    };

    if (postId) fetchSavesCount(); // Fetch only if postId is valid
  }, [postId, userSavedArray]);

  // Log changes to noOfSaves for debugging purposes
  return (
    <div className="relative lg:flex lg:flex-col lg:items-end lg:p-3 lg:min-w-48">
      <div className="sticky bottom-0 lg:mt-10 w-screen flex justify-around lg:flex-col lg:justify-normal lg:w-0">
        <p className="flex flex-col justify-center items-center mb-4 text-2xl font-thin">
          <FaRegComment />
          {noOfComment}
        </p>
        <p
          className={`flex flex-col justify-center items-center mb-4 text-2xl font-thin ${
            userData && likesArray.includes(userData._id) ? "text-red-500" : ""
          }`}
        >
          <button onClick={() => handleLike()}>
            <AiOutlineLike />
          </button>

          {likesArray.length}
        </p>
        <p
          className={` flex flex-col justify-center items-center mb-4 text-2xl font-thin ${
            userData && userData.savedList.includes(postId)
              ? "text-orange-400"
              : ""
          }`}
        >
          <button onClick={handleSave}>
            <IoBookmarkOutline />
          </button>
          {`${noOfSaves}`}
        </p>
      </div>
    </div>
  );
}

export default SideBar;
