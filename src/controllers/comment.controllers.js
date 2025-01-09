// CRUD for comments
import { Comment } from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new comment
const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  const userId = req.user._id;
  console.log(userId);

  if (!content || !blogId) {
    throw new ApiError(400, "Content and blogId must be provided");
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const comment = await Comment.create({
    content,
    bloggedAt: blogId,
    owner: userId,
  });

  blog.commentedBy.push(comment._id);
  await blog.save();

  return res.status(201).json(new ApiResponse(201, "Comment created", comment));
});

// Get all comments for a blog
const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is missing");
  }

  const comments = await Comment.find({ bloggedAt: blogId }).populate(
    "owner",
    "username profilePicURL"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", comments));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw new ApiError(400, "Content must be provided");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment updated successfully", comment));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  const blog = await Blog.findById(comment.bloggedAt);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await Comment.deleteOne({ _id: commentId });

  blog.commentedBy = blog.commentedBy.filter(
    (id) => id.toString() !== comment._id.toString()
  );
  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully"));
});

const likeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.likedby.includes(userId)) {
    comment.likedby = comment.likedby.filter(
      (id) => id.toString() !== userId.toString()
    );
    comment.NumberofLikes = comment.NumberofLikes - 1;
  } else {
    comment.likedby.push(userId);
    comment.NumberofLikes = comment.NumberofLikes + 1;
  }

  await comment.save();
  console.log(comment);

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment liked successfully", comment));
});

export {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
  likeComment,
};
