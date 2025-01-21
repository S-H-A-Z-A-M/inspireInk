import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DeleteCloudinaryAsset = async (publicURI) => {
  try {
    const publicId = publicURI.split("/")[-1].split(".")[0];
    const response = await cloudinary.uploader.destroy(publicId);
    console.log("Image deleted successfully");
    return response;
  } catch (error) {
    return null;
  }
};

export { DeleteCloudinaryAsset };
