import { Readable } from "stream";

import cloudinary from "../config/cloudinary";

/* =========================================================
   UPLOAD PRODUCT IMAGE TO CLOUDINARY
========================================================= */

export const uploadProductImage = async (
  file: Express.Multer.File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "hipster/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(
            new Error("Cloudinary did not return an upload result")
          );
          return;
        }

        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};