import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { DeleteCloudinaryAsset } from "../utils/deleteCloudinary.js";

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
  const page = Math.max(1, parseInt(req.query.page)) || 1;
  const sorting = req.query.sorting || "latest"; // default sorting
  const search = req.query.search || ""; // default search
  const limit = 8;
  const skip = (page - 1) * limit;

  let sortStage = {};

  if (sorting === "latest") {
    sortStage = { updatedAt: -1 };
  } else if (sorting === "likes") {
    sortStage = { likeCount: -1 };
  } else if (sorting === "comments") {
    sortStage = { commentCount: -1 };
  }

  const blogs = await Blog.aggregate([
    {
      $addFields: {
        likeCount: { $size: { $ifNull: ["$likedBy", []] } },
        commentCount: { $size: { $ifNull: ["$commentedBy", []] } },
      },
    },
    {
      $match: {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $sort: sortStage,
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        title: 1,
        content: 1,
        updatedAt: 1,
        slug: 1,
        likedBy: 1,
        commentedBy: 1,
        coverImage: 1,
        createdAt: 1,
        "owner.username": 1,
        "owner.name": 1,
        "owner.profilePicURL": 1,
      },
    },
  ]);

  const totalBlogs = await Blog.countDocuments({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ],
  });

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
  const { oldSlug } = req.params;
  const { slug, title, content } = req.body;

  if (!oldSlug) {
    throw new ApiError(400, "slug is missing");
  }

  const blog = await Blog.findOne({ slug: oldSlug });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this blog");
  }

  if (title) {
    const existingBlogWithNewSlug = await Blog.findOne({ slug: slug });

    if (
      existingBlogWithNewSlug &&
      existingBlogWithNewSlug._id.toString() !== blog._id.toString()
    ) {
      throw new ApiError(400, "A blog with this title already exists");
    }

    blog.slug = slug;
  }

  if (content) {
    blog.content = content;
  }

  if (title) {
    blog.title = title;
  }

  const coverImageLocalPath = req.file?.path;
  if (coverImageLocalPath) {
    const coverImage = await uploadCloudinary(coverImageLocalPath);
    if (!coverImage) {
      throw new ApiError(500, "Error while uploading cover image");
    }
    const tempUrl = blog.coverImage;
    const response = DeleteCloudinaryAsset(tempUrl);
    if (!response) {
      throw new ApiError(500, "Error while deleting previous file");
    }

    blog.coverImage = coverImage.url;
  }

  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog updated successfully", blog));
});

const likeBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;
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
