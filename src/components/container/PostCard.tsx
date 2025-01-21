import { Divide } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import AlertDialogSlide from "./AlertDialogSlide";
import { Button } from "@mui/material";

function PostCard({
  _id,
  slug,
  title,
  coverImage,
  isuserPage = false,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="w-full justify-center items-center p-2 rounded-xl overflow-hidden flex flex-col bg-[#ede2db] shadow-lg mb-4">
      <Link to={`/blog/${slug}`}>
        <div className="">
          {/* Image container that takes full width */}
          <div className="w-full max-w-[64rem] h-[36rem] relative overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover min-w-max"
            />
          </div>

          {/* Title container with padding and shadow */}
          <h2 className="p-4 text-3xl font-semibold shadow-inner">{title}</h2>
        </div>
      </Link>
      {isuserPage && (
        <div>
          <Button sx={{marginRight:'10px',background:"#333"}} variant="contained" color="success" onClick={() => handleEdit(slug)}>Edit Post</Button>
          <AlertDialogSlide handleDelete={handleDelete} toDeleteSlug={slug} />
        </div>
      )}
    </div>
  );
}

export default PostCard;
