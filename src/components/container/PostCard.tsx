import React from "react";
import { Link } from "react-router-dom";

function PostCard({ _id, slug, title, coverImage }) {
  return (
    <Link to={`/blog/${slug}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4 ">
          <img src={coverImage} alt={title} />
        </div>
        <h2>{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
