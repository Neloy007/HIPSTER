import { Request, Response } from "express";

import { uploadProductImage } from "../services/cloudinaryService";

/* =========================================================
   UPLOAD PRODUCT IMAGES
========================================================= */

export const uploadProductImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files;

    /* -------------------------------------------------------
       CHECK UPLOADED FILES
    ------------------------------------------------------- */

    if (!Array.isArray(files) || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please select at least one image",
      });

      return;
    }

    /* -------------------------------------------------------
       UPLOAD IMAGES TO CLOUDINARY
    ------------------------------------------------------- */

    const imageUrls: string[] = [];

    for (const file of files) {
      const imageUrl = await uploadProductImage(file);

      imageUrls.push(imageUrl);
    }

    /* -------------------------------------------------------
       SUCCESS RESPONSE
    ------------------------------------------------------- */

    res.status(200).json({
      success: true,
      message: "Product images uploaded successfully",
      data: {
        images: imageUrls,
      },
    });
  } catch (error) {
    console.error("Product image upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload product images",
    });
  }
};