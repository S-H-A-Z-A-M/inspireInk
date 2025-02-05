import { useState } from "react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { commentApi } from "@/axios";
import { Separator } from "../ui/separator";
import moment from "moment";

function Comment({ comment, onEdit, onDelete, onLike }: any) {
  // const { register, handleSubmit } = useForm();
  const userData = useSelector((state: any) => state.auth.userData);
  const [editMode, setEditMode] = useState(false);
  const [editcomment, setEditComment] = useState(comment.content);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const response = await commentApi.patch(`/edit-comment/${comment._id}`, {
        content: editcomment,
      });
      if (response.data.data === "Comment updated successfully") {
        setEditMode(false);
        onEdit(comment, editcomment);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex">
      <div className="mt-1">
        <img
          className="h-10 w-10 rounded-full"
          src={comment.owner.profilePicURL}
          alt={comment.owner.name}
        />
      </div>
      <div className="flex-grow ml-4">
        {comment && (
          <div className="mb-4">
            <div className="flex justify-between">
              <p className="font-bold">{comment.owner.username}</p>
              <p>Date: {moment(comment.createdAt).format("MMM Do YY")}</p>
            </div>
            {editMode ? (
              <div>
                <textarea
                  rows={3}
                  value={editcomment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full"
                ></textarea>
                <div className="flex gap-4">
                  <Button onClick={() => setEditMode(false)}>Cancel</Button>
                  <Button className="bg-blue-700" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="ml-2">
                <div>{comment.content}</div>
                <div className="flex gap-4 items-center mb-2">
                  <Button
                    className="p-4"
                    variant={"outline"}
                    onClick={() => onLike(comment._id)}
                  >
                    Like
                  </Button>
                  <p>{comment.NumberofLikes}</p>
                </div>
                {userData && userData._id === comment.owner._id && (
                  <div className="flex gap-4">
                    <Button className="" onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => onDelete(comment._id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
            <Separator className="mt-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
