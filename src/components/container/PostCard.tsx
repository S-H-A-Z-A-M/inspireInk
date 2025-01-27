import { Link } from "react-router-dom";
import AlertDialogSlide from "./AlertDialogSlide";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import parse from "html-react-parser";
import moment from "moment";
import { useSelector } from "react-redux";

function PostCard({
  slug,
  title,
  likedBy,
  content,
  commentedBy,
  coverImage,
  isuserPage = false,
  handleEdit,
  handleDelete,
  owner,
  createdAt,
}: any) {
  const userData = useSelector((state: any) => state.auth.userData);
  return (
    <div className="w-full max-w-[70rem] mx-auto overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 mb-2">
      <Link to={`/blog/${slug}`}>
        <div className=" p-6 flex items-center gap-4">
          <img
            className=" rounded-full h-8 w-8"
            src={owner.profilePicURL}
            alt={`${owner.name}'s profile`}
          />
          <Link to={`/users/${owner.username}`}>
            <p className="text-gray-700 hover:underline">{owner.name}</p>
          </Link>
        </div>

        <div className="relative group">
          <div className="overflow-hidden flex flex-row-reverse justify-between px-8">
            <img
              src={coverImage}
              alt={title}
              className="h-[200px] w-[250px] object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold leading-tight">{title}</h2>
              <p className="browser-css text-lg text-justify line-clamp-2 mt-4">
                {parse(content)}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 flex gap-4">
          <h2>Published at : {moment(createdAt).format("MMM Do YY")}</h2>
          <h2>Likes: {likedBy.length}</h2>
          <h2>Comments: {commentedBy.length}</h2>
        </div>
      </Link>

      {isuserPage && userData && userData._id === owner && (
        <div className="flex justify-end gap-4 p-4 bg-gray-50">
          <Button
            onClick={() => handleEdit(slug)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Post
          </Button>
          <AlertDialogSlide handleDelete={handleDelete} toDeleteSlug={slug} />
        </div>
      )}
    </div>
  );
}

export default PostCard;
