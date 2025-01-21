import React from "react";
import { Link } from "react-router-dom";
import AlertDialogSlide from "./AlertDialogSlide";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit } from "lucide-react";

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
    <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
      <Link to={`/blog/${slug}`}>
        <div className="relative group">
          {/* Image container with hover effect */}
          <div className="aspect-[23/10] overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Title with gradient overlay */}
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold leading-tight hover:text-blue-600 transition-colors duration-200">
              {title}
            </h2>
          </CardContent>
        </div>
      </Link>

      {isuserPage && (
        <CardFooter className="flex justify-end gap-4 p-4 bg-gray-50">
          <Button
            onClick={() => handleEdit(slug)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Post
          </Button>
          <AlertDialogSlide handleDelete={handleDelete} toDeleteSlug={slug} />
        </CardFooter>
      )}
    </Card>
  );
}

export default PostCard;