import { commentApi } from "@/axios";
import Comment from "@/components/comments/Comment.tsx";
import { get } from "node_modules/axios/index.d.cts";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function CommentSection({ postId, id, updateComment }) {
  const userData = useSelector((state) => state.auth.userData);
  const naviagte = useNavigate();
  const [comments, setComments] = useState([]);
  const [reaminingChars, setRemainingChars] = useState(200);
  const [newComment, setNewComment] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await commentApi.get(`/get-comments/${postId}`);
        if (response) {
          updateComment(response.data.message.length);
          // console.log(response.data.message);
          setComments(response.data.message);
        } else {
          console.error("Something went wrong");
        }
      } catch (err) {
        console.error(err);
      }
    };
    getComments();
  }, [postId, newComment]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "content") {
        const contentLength = value.content ? value.content.length : 0;
        setRemainingChars(200 - contentLength);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const submit = async (data) => {
    try {
      const response = await commentApi.post(`/create-comment/${postId}`, data);
      if (response) {
        reset();
        setRemainingChars(200);
        // updateComment(comments.length);
        setNewComment(!newComment);
      } else {
        console.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      naviagte("/login");
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await commentApi.delete(`/delete-comment/${commentId}`);
      if (response) {
        const updatedComments = comments.filter((c) => c._id !== commentId);
        setComments(updatedComments);
        updateComment(updatedComments.length);
      } else {
        console.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!userData) {
        naviagte("/login");
      }
      console.log("here");
      const response = await commentApi.patch(`/like-comment/${commentId}`);
      console.log("here");
      console.log(response);
      if (response) {
        setComments(
          comments.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  likedby: response.data.message.likedby,
                  NumberofLikes: response.data.message.likedby.length,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="w-full">
      {userData ? (
        <div className="flex items-center justify-start">
          <p className="pr-2">Signed in as :</p>
          <img
            className="h-5 w-5 rounded-full mr-2"
            src={userData.profilePicURL}
            alt=""
          />
          {/* to add redirect to dashboard */}
          <Link to={`/users/${userData.username}`}>@{userData.name}</Link>
        </div>
      ) : (
        <div>
          <p>Please sign in to leave a comment.</p>
          <Link to="/login">Sign In</Link>
        </div>
      )}
      <div
        id={id}
        className="mt-2 w-[800px] border border-outline p-5 rounded-lg"
      >
        <form onSubmit={handleSubmit(submit)}>
          <textarea
            maxLength={200}
            rows={3}
            id=""
            placeholder="add a comment"
            className="w-full p-2 border border-outline rounded-xl"
            {...register("content", { required: true })}
          ></textarea>
          <div className="flex gap-4 items-center justify-between mt-3">
            <p>{reaminingChars} letters are remaining</p>
            <button
              className="border border-outline p-3 rounded-xl"
              type="submit"
            >
              {" "}
              Submit{" "}
            </button>
          </div>
        </form>
        {comments.length === 0 ? (
          <div>
            <p>No comments yet</p>
          </div>
        ) : (
          <div>
            {comments.map((comment) => (
              <Comment
                onEdit={handleEdit}
                onDelete={handleDelete}
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                updateComment={updateComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
