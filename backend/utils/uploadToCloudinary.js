import cloudinary from "../config/cloudinary.js";

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Multer files (memory storage)
 * @param {String} folder - Cloudinary folder name
 * @returns {Array} image URLs
 */
export const uploadImagesToCloudinary = async (
    files,
    folder
) => {
    const uploadedImages = [];

    for (const file of files) {
        const base64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(
            dataUri,
            {
                folder,
                resource_type: "image"
            }
        );

        uploadedImages.push(result.secure_url);
    }

    return uploadedImages;
};
