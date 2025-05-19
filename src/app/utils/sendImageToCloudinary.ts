
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import config from "../config";


const deleteFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (err: any) {
    console.error(`Error deleting file: ${err.message}`);
  }
};

export const uploadImgToCloudinary = async (name: string, filePath: string) => {

  cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY,
    api_secret: config.API_SECRATE,
  });

  try {

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: name,
    });

    // console.log("Upload result:", uploadResult);

  
    await deleteFile(filePath);


    return uploadResult;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

export const uploadMultipleImages = async (filePaths: string[]) => {
  try {
 
    const imageUrls: string[] = [];
    for (const filePath of filePaths) {
      const imageName = `${Math.floor(
        100 + Math.random() * 900
      )}-${Date.now()}`; 
      const uploadResult = await uploadImgToCloudinary(imageName, filePath);
      imageUrls.push(uploadResult.secure_url); 
    }


    return imageUrls;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Multiple image upload failed");
  }
};

// Multer storage configuration for local file saving
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads")); // Define folder for temporary file storage
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix); // Generate unique file name
  },
});

// Multer upload setup
export const upload = multer({ storage: storage });