// import { blogApi } from "@/axios";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// function SideBar({
//   noOfComment,
//   likesArray,
//   userSavedArray,
//   handleLike,
//   handleSave,
//   postId,
// }) {
//   const [noOfSaves, setNoOfSaves] = useState(0);
//   const userData = useSelector((state) => state.auth.userData);
//   useEffect(() => {
//     const response = async () => {
//       const data = await blogApi
//         .get(`/count-blog-saves/${postId}`)
//         .then((data) => setNoOfSaves(data.message))
//         .then(() => console.log(noOfSaves));
//     };
//     response();
//   }, [postId]);

//   return  (
//     <div>
//       <div>
//         <p>comments: {noOfComment}</p>
//         {/* <p
//           className={`${
//             userData && likesArray.includes(userData._id) && "text-color-red"
//           }`}
//         >
//           Likes: {likesArray ? likesArray.length : 0}
//         </p> */}
//         <p
//           className={`${
//             userData &&
//             userData.user.savedList.includes(postId) &&
//             "text-color-orange"
//           }`}
//         >
//           Saved: {`${noOfSaves}`}
//         </p>
//         <button onClick={() => handleLike()}>like</button>
//         <button onClick={() => handleSave()}>save</button>
//       </div>
//     </div>
//   );
// }

// export default SideBar;

import { blogApi } from "@/axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function SideBar({
  noOfComment,
  likesArray,
  userSavedArray,
  handleLike,
  handleSave,
  postId,
}) {
  const [noOfSaves, setNoOfSaves] = useState(0);
  const userData = useSelector((state) => state.auth.userData)    ;

  console.log(userData)
  useEffect(() => {
    const fetchSavesCount = async () => {
      try {
        const response = await blogApi.get(`/count-blog-saves/${postId}`);
        if (response && response.data) {
          console.log(response.data.message);
          setNoOfSaves(response.data.message); // Set the count properly
          console.log("API Response:", response.data.message); // Log the API response
        }
      } catch (error) {
        console.error("Error fetching save count:", error);
      }
    };

    if (postId) fetchSavesCount(); // Fetch only if postId is valid
  }, [postId, userSavedArray]);

  // Log changes to noOfSaves for debugging purposes

  return (
    <div>
      <div>
        <p>Comments: {noOfComment}</p>
        <p
          className={`${
            userData && likesArray.includes(userData._id) && "text-color-red"
          }`}
        >
          Likes: {likesArray.length}
        </p>
        <p
          className={`${
            userData &&
            userData.savedList.includes(postId) &&
            "text-color-orange"
          }`}
        >
          Saved: {`${noOfSaves}`}
        </p>
        <button onClick={() => handleLike()}>Like</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default SideBar;
