import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  const { title, content, slug } = req.body;

  if (
    [title, content, slug].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields must be provided");
  }
  const user = req.user;
  const owner = user._id;

  const existedBlog = await Blog.findOne({
    slug,
  });

  if (existedBlog) {
    throw new ApiError(400, "Blog already exists");
  }

  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is missing");
  }
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(500, "Error while uploading cover image");
  }

  const blog = await Blog.create({
    owner,
    slug,
    title,
    content,
    coverImage: coverImage.url,
    likeBy: [],
    commentedBy: [],
  });

  const createdBlog = await Blog.findById(blog._id);

  user.blogList.push(blog._id);
  await user.save();

  if (createBlog) {
    return res
      .status(201)
      .json(new ApiResponse(201, "Blog created", createdBlog));
  } else {
    throw new ApiError(500, "Error while creating blog");
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "slug is missing");
  }

  const user = req.user;
  const blog = await Blog.findOne({ slug });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this blog");
  }

  await Blog.deleteOne({ slug: slug });

  const deletedBlog = await Blog.findOne({ slug });
  if (deletedBlog) {
    throw new ApiError(500, "Error while deleting blog");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Blog deleted successfully"));
});
const deleteBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!slug) {
    throw new ApiError(400, "slug is missing");
  }

  const user = req.user;
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this blog");
  }

  await blog.remove();

  const deletedBlog = await Blog.findById(id);
  if (deletedBlog) {
    throw new ApiError(500, "Error while deleting blog");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Blog deleted successfully"));
});

const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  console.log(slug);

  if (!slug) {
    throw new ApiError(400, "slug is missing");
  }

  const blog = await Blog.findOne({ slug });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res.status(200).json(new ApiResponse(200, "Blog found", blog));
});
const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!slug) {
    throw new ApiError(400, "slug is missing");
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res.status(200).json(new ApiResponse(200, "Blog found", blog));
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const skip = (page - 1) * limit;

  const blogs = await Blog.find()
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalBlogs = await Blog.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs,
        totalPages: Math.ceil(totalBlogs / limit),
        currentPage: page,
      },
      "Blogs fetched successfully"
    )
  );
});

const editBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;

  if (!slug) {
    throw new ApiError(400, "slug is missing");
  }

  const blog = await Blog.findOne({ slug });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this blog");
  }

  if (title) {
    const newSlug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s]+/g, "-")
      .replace(/\s/g, "-");
    const existingBlogWithNewSlug = await Blog.findOne({ slug: newSlug });

    if (
      existingBlogWithNewSlug &&
      existingBlogWithNewSlug._id.toString() !== blog._id.toString()
    ) {
      throw new ApiError(400, "A blog with this title already exists");
    }

    blog.slug = newSlug;
  }

  if (content) {
    blog.content = content;
  }

  if (title) {
    blog.title = title;
  }

  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog updated successfully", blog));
});

const likeBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  const user = req.user;

  if (!slug) {
    throw new ApiError(400, "slug is missing");
  }

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.likedBy.includes(user._id)) {
    blog.likedBy = blog.likedBy.filter(
      (id) => id.toString() !== user._id.toString()
    );
  } else {
    blog.likedBy.push(user._id);
  }

  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog liked successfully", blog));
});

const countBlogSaves = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "postId is missing");
  }

  const count = await User.countDocuments({ savedList: postId });

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog save count fetched", count));
});

export {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  editBlog,
  deleteBlogById,
  getBlogById,
  likeBlog,
  countBlogSaves,
};
