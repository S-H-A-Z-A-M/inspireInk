import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/container/Button";
import Input from "@/components/container/Input";
import { blogApi } from "@/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { commentApi } from "@/axios";

function Comment({ comment, onEdit, onDelete, onLike }) {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
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
    <div className="flex gap-4 items-center">
      <div>
        <img
          className="h-10 w-10 rounded-full"
          src={comment.owner.profilePicURL}
          alt={comment.owner.name}
        />
      </div>
      <div>
        {comment && (
          <div>
            <div className="flex justify-between">
              <p>{comment.owner.username}</p>
              <p>Date</p>
            </div>
            {editMode ? (
              <div>
                <textarea
                  rows={3}
                  value={editcomment}
                  onChange={(e) => setEditComment(e.target.value)}
                ></textarea>
                <div>
                  <Button onClick={() => setEditMode(false)}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </div>
            ) : (
              <div>
                <div>{comment.content}</div>
                <div className="flex gap-4">
                  <Button
                    className=" bg-inherit"
                    onClick={() => onLike(comment._id)}
                  >
                    Like
                  </Button>
                  <p>{comment.NumberofLikes}</p>
                </div>
                {userData && userData._id === comment.owner._id && (
                  <div className="flex gap-4">
                    <Button className=" bg-inherit" onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button
                      className=" bg-inherit"
                      onClick={() => onDelete(comment._id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
