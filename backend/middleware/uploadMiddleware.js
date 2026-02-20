import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary (It uses env vars automatically if named correctly, or we can force it)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat_attachments",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

export const upload = multer({ storage });
export const memoryUpload = multer({ storage: multer.memoryStorage() });
