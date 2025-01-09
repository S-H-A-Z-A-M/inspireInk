import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { DeleteCloudinaryAsset } from "../utils/deleteCloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.RefreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      " Something went wrong while generating access token and refresh token"
    );
  }
};

const refreshaccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(404, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(404, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            refreshToken: newrefreshToken,
            accessToken,
          },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  // Extracting data from the request body
  const { name, email, username, password, about } = req.body;

  if (
    [name, email, username, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields must be provided");
  }

  // Check if the user already exists (by username or email)

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  // Handle avatar upload (if provided)
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = await User.create({
    name,
    email,
    username: username,
    password,
    about: about || "",
    isAdmin: false,
    savedList: [],
    blogList: [],
    RefreshToken: null,
    profilePicURL: avatar.url,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  user.RefreshToken = refreshToken;
  await user.save();

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Remove sensitive fields and retrieve created user
  const createdUser = await User.findById(user._id).select(
    "-password -RefreshToken"
  );

  // Check if user creation was successful and send response
  if (createdUser) {
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: createdUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } else {
    throw new ApiError(500, "User creation failed");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input: Ensure either email or username is provided
  if (!email) {
    throw new ApiError(401, "Username or Email is required");
  }

  // Find user by username or email
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the password is correct
  const isPasswordValid = await user.isPasswordCorrect(password); // Assuming you have a method `isPasswordCorrect` in your schema for password comparison
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
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
    "-password -RefreshToken"
  );

  // Set cookie options
  const options = {
    httpOnly: true, // Accessible only by the web server
    secure: true,
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

const logoutUser = asyncHandler(async (req, res) => {
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
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await User.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(404, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password updated"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetch successfully"));
});

const saveBlog = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const user = req.user;

  if (user.savedList.includes(postId)) {
    user.savedList = user.savedList.filter(
      (id) => id.toString() !== postId.toString()
    );
  } else {
    user.savedList.push(postId);
  }

  await user.save();

  console.log(user.savedList);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Blog saved successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshaccessToken,
  changeCurrentPassword,
  getCurrentUser,
  saveBlog,
};
