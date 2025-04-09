import { Link } from "react-router-dom";
import AlertDialogSlide from "./AlertDialogSlide";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import parse from "html-react-parser";
import moment from "moment";
import { useSelector } from "react-redux";
import { Separator } from "@radix-ui/react-separator";

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
    <div className="w-full max-w-[20rem]  sm:max-w-[25rem] md:max-w-[50rem] lg:max-w-[70rem] mx-auto overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 mb-2 pb-4">
      <Link to={`/blog/${slug}`}>
        <div className=" p-6 flex items-center gap-4">
          <img
            className="rounded-full h-8 w-8"
            src={owner.profilePicURL}
            alt={`${owner.name}'s profile`}
          />
          <Link to={`/users/${owner.username}`}>
            <p className="text-gray-700 hover:underline">{owner.name}</p>
          </Link>
        </div>

        <div className="relative group">
          <div className="overflow-hidden text-left lg:flex flex-row-reverse justify-left lg:justify-between px-8">
            <img
              src={coverImage}
              alt={title}
              className=" h-[150px] w-full md:h-[250px] lg:h-[200px] md:w-full lg:w-[300px] transform group-hover:scale-105 transition-transform duration-300 mb-4"
            />
            <div className="lg:p-6 lg:mr-10 overflow-hidden">
              <h2 className="text-2xl lg:text-3xl font-semibold leading-tight mt-2 lg:mt-0">
                {title}
              </h2>
              <p className="sm:text-base pl-2 lg:text-lg line-clamp-2 mt-4">
                {parse(content)}
              </p>
            </div>
          </div>
        </div>
        <Separator className="border mx-9 border-gray-300 lg:border-none mt-2" />
        <div className="pl-10 mt-2   text-left lg:p-6 lg:flex lg:gap-4">
          <h2>Published at : {moment(createdAt).format("MMM Do YY")}</h2>
          <h2>Likes: {likedBy?.length || 0}</h2>
          <h2>Comments: {commentedBy?.length || 0}</h2>
        </div>
      </Link>

      {isuserPage && userData && userData._id === owner._id && (
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
