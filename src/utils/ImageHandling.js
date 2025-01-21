// import { ApiError } from "./ApiError.js";
// import { asyncHandler } from "./asyncHandler.js";
// import { uploadCloudinary } from "./cloudinary.js";
// import { DeleteCloudinaryAsset } from "./deleteCloudinary.js";
// import { ApiResponse } from "./ApiResponse.js";

// const uploadImage = asyncHandler(async (req, res) => {
//   const filePath = req.file?.path;

//   if (!filePath) {
//     throw new ApiError(400, "Image is missing");
//   }

//   const image = await uploadCloudinary(filePath);

//   if (!image.url) {
//     throw new ApiError(500, "Error while uploading file");
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, { imageUrl: image }, "Image uploaded successfully")
//     );
// });

// const deleteImage = asyncHandler(async (req, res) => {
//   const { publicId } = req.params;
//   if (!publicId) {
//     throw new ApiError(400, "File id is missing");
//   }
//   console.log(publicId);
//   const response = await DeleteCloudinaryAsset(publicId);

//   console.log(response);
//   if (!response) {
//     throw new ApiError(500, "Error while deleting image");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, { response }, "image deleted succesfully"));
// });

// const editImage = asyncHandler(async (req, res) => {
//   const { publicId } = req.params;
//   const filePath = req.file?.path;

//   if (!filePath) {
//     throw new ApiError(400, "Image is missing");
//   }

//   const image = await uploadCloudinary(filePath);

//   if (!image.url) {
//     throw new ApiError(500, "Error while uploading file");
//   }

//   if (!publicId) {
//     throw new ApiError(400, "File id is missing");
//   }

//   const response = await DeleteCloudinaryAsset(publicId);

//   if (!response) {
//     throw new ApiError(500, "Error while deleting image");
//   }

//   return res.status(200).json(new ApiResponse(200, image.url, "image updated"));
// });

// export { uploadImage, deleteImage, editImage };
