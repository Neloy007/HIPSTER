import multer from "multer";

/* =========================================================
   ALLOWED IMAGE TYPES
========================================================= */

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   MULTER CONFIGURATION
========================================================= */

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per image
    files: 5, // Maximum 5 images per request
  },

  fileFilter: (_req, file, callback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Only JPEG, PNG, and WEBP images are allowed"
        )
      );
    }
  },
});

/* =========================================================
   PRODUCT IMAGE UPLOAD MIDDLEWARE
========================================================= */

export const uploadProductImages = upload.array(
  "images",
  5
);