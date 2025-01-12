import React from "react";
import { Link } from "react-router-dom";

function PostCard({ _id, slug, title, coverImage }) {
  return (
    <Link to={`/blog/${slug}`}>
      <div className="w-full p-2 rounded-xl overflow-hidden flex flex-col bg-[#ede2db] shadow-lg">
        {/* Image container that takes full width */}
        <div className="w-full h-[36rem] relative">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title container with padding and shadow */}
        <h2 className="p-4 text-3xl font-semibold shadow-inner">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
