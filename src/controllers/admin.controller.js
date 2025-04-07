import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DeleteCloudinaryAsset } from "../utils/deleteCloudinary.js";
import { generateAccessAndRefreshToken } from "./user.controllers.js";
import admin from "../utils/firebaseAdmin.js";
import { Comment } from "../models/comment.model.js";

const getLastSixMonthsStats = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // include current month

  const stats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(sixMonthsAgo.setDate(1)) }, // from 1st day of that month
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  // Optional: Format nicely

  const formattedStats = stats.map((stat) => ({
    month: `${stat._id.month} ${stat._id.year}`,
    totalUsers: stat.totalUsers,
  }));

  return formattedStats;
};

const dashboard = asyncHandler(async (req, res) => {
  try {
    const users = await User.countDocuments();
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const user = await User.countDocuments({ role: "user" });
    const admin = await User.countDocuments({ role: "admin" });
    const superadmin = await User.countDocuments({ role: "superadmin" });

    const countData = {
      users,
      blogs,
      comments,
    };

    const roleData = {
      user,
      admin,
      superadmin,
    };
    const stats = await getLastSixMonthsStats();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { stats, countData, roleData },
          "Dashboard data fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Internal Server Error", error.message);
  }
});

const googlelogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const email = decodedToken.email;
  const user = await User.findOne({ email });
  if (user) {
    if (user.role !== "admin" && user.role !== "superadmin") {
      throw new ApiError(403, "Admin Access is required");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    user.RefreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select(
      "-password -RefreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } else {
    throw new ApiError(404, "User not found");
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(401, "Email is required");
  }

  // Find user by username or email
  const user = await User.findOne({ email: email });
  if (!user) {
    // next(new ApiError(404, "Resource not found"));
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    throw new ApiError(403, "Admin Access is required");
  }

  // Check if the password is correct
  const isPasswordValid = await user.isPasswordCorrect(password); // Assuming you have a method `isPasswordCorrect` in your schema for password comparison
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid admin credentials");
  }
  // Generate Access Token and Refresh Token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Save the Refresh Token in the database
  user.RefreshToken = refreshToken;
  await user.save();

  // Exclude sensitive data (password and RefreshToken) from the response
  const loggedInUser = await User.findById(user._id).select(
    "-password -RefreshToken -about -savedList -blogList -createdAt -updatedAt -name"
  );

  // Set cookie options
  const options = {
    httpOnly: true, // Accessible only by the web server
    secure: true,
    sameSite: "None",
  };

  // Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getUsers = asyncHandler(async (req, res) => {
  //profile username status email
  const Users = await User.find().select(
    "-password -_id -name -about -savedList -blogList -RefreshToken"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        Users,
      },
      "Users fetched successfully"
    )
  );
});

const getUser = asyncHandler(async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username })
    .select("-password -RefreshToken -name -about -savedList")
    .lean();
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const modifiedUser = {
    ...user,
    blogCount: user.blogList.length,
  };
  delete modifiedUser.blogList;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        modifiedUser,
      },
      "user fetched successfully"
    )
  );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "admin" && user.role !== "superadmin") {
    throw new ApiError(403, "Admin Access is required");
  }
  const modifiedUser = {
    ...user,
    blogCount: user.blogList.length,
  };
  delete modifiedUser.blogList;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        modifiedUser,
      },
      "user fetched successfully"
    )
  );
});

const getBlogs = asyncHandler(async (req, res) => {
  //title author comments likes published_date
  const Blogs = await Blog.find()
    .select("-coverImage -content -_id -updatedAt")
    .populate("owner", "username")
    .lean(); // Convert Mongoose documents to plain JS objects for modification

  const modifiedBlogs = Blogs.map((blog) => ({
    owner: blog.owner,
    slug: blog.slug,
    title: blog.title,
    likesCount: blog.likedBy.length, // Get count instead of IDs
    commentsCount: blog.commentedBy.length, // Get count instead of IDs
    createdAt: blog.createdAt,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        modifiedBlogs,
      },
      "Nlogs fetched successfully"
    )
  );
});

const getBlog = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  const blog = await Blog.findOne({ slug })
    .lean()
    .populate("owner", "username");
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const modifiedBlog = {
    ...blog,
    likesCount: blog.likedBy.length,
    commentsCount: blog.commentedBy.length,
  };

  delete modifiedBlog.likedBy;
  delete modifiedBlog.commentedBy;

  return res
    .status(200)
    .json(new ApiResponse(200, { modifiedBlog }, "blog fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin" || user.role === "superadmin") {
    throw new ApiError(401, "Cannot delete admin or superadmin user");
  }

  //TODO: change this method to findOneDelete after completing below todo
  // Start a session for transaction
  const session = await User.startSession();
  await session.startTransaction();

  try {
    // Find all blogs created by the user
    const blogs = await Blog.find({ owner: user._id });

    // Delete associated comments (optional)
    for (const blog of blogs) {
      await Comment.deleteMany({ _id: { $in: blog.commentedBy } }, { session }); // optional
      await DeleteCloudinaryAsset(blog.coverImage); // optional
    }

    // Delete blogs
    await Blog.deleteMany({ owner: user._id }, { session });

    // Delete user
    await User.deleteOne({ _id: user._id }, { session });

    // Optional: delete profile image
    if (user.profilePicURL) {
      await DeleteCloudinaryAsset(user.profilePicURL); // optional
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "User and associated data deleted successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Error deleting user\n" + error.message);
  }
});

const grantAdminRights = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  if (user.role === "admin") {
    throw new ApiError(401, "User already have admin rights");
  }

  user.role = "admin";

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "user granted admin priviliges successfully")
    );
});

const revokeAdminRights = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  if (user.role !== "admin") {
    throw new ApiError(401, "User doesn't have super admin rights");
  }

  user.role = "user";

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "user revoked admin privileges successfully")
    );
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "slug is missing");
  }

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  //TODO: uncomment below line after implementing following:
  const session = await Blog.startSession();

  await session.startTransaction();
  try {
    // await Comment.deleteMany({ _id: { $in: blog.commentedBy } }, { session });
    // await Blog.deleteOne({ slug }, { session });
    await session.commitTransaction();
    session.endSession();
    await DeleteCloudinaryAsset(blog.coverImage);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message);
  }

  const deletedBlog = await Blog.findOne({ slug });
  if (deletedBlog) {
    throw new ApiError(500, "Error while deleting blog");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Blog deleted successfully"));
});

export {
  dashboard,
  getUsers,
  getUser,
  getCurrentUser,
  deleteUser,
  grantAdminRights,
  revokeAdminRights,
  getBlogs,
  getBlog,
  deleteBlog,
  loginUser,
  googlelogin,
  logout,
};
