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
          console.log(response.data.message);
          setNoOfSaves(response.data.message); // Set the count properly
          // console.log("API Response:", response.data.message); // Log the API response
        }
      } catch (error) {
        console.error("Error fetching save count:", error);
      }
    };

    if (postId) fetchSavesCount(); // Fetch only if postId is valid
  }, [postId, userSavedArray]);

  // Log changes to noOfSaves for debugging purposes
  return (
    <div className="relative flex flex-col items-end p-3 min-w-48">
  {/* Sidebar container */}
  <div className="fixed top-20 right-5 space-y-6">
    {/* Comments */}
    <div className="flex flex-col items-center text-2xl font-thin">
      <FaRegComment />
      <p>{noOfComment}</p>
    </div>

    {/* Likes */}
    <div
      className={`flex flex-col items-center text-2xl font-thin ${
        userData && likesArray.includes(userData._id) ? "text-red-500" : ""
      }`}
    >
      <button onClick={handleLike}>
        <AiOutlineLike />
      </button>
      <p>{likesArray.length}</p>
    </div>

    {/* Save Post */}
    <div
      className={`flex flex-col items-center text-2xl font-thin ${
        userData && userData.savedList.includes(postId) ? "text-orange-400" : ""
      }`}
    >
      <button onClick={handleSave}>
        <IoBookmarkOutline />
      </button>
      <p>{noOfSaves}</p>
    </div>
  </div>
</div>

  );
}

export default SideBar;
