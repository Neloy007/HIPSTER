import { Router } from "express";

import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/roleMiddleware";

import { uploadProductImages as uploadProductImagesController } from "../controllers/uploadController";

import { uploadProductImages } from "../middleware/uploadMiddleware";

/* =========================================================
   UPLOAD ROUTES
========================================================= */

const router = Router();

/* =========================================================
   UPLOAD PRODUCT IMAGES
========================================================= */

// Only authenticated admins can upload product images
router.post(
  "/product-images",
  protect,
  adminOnly,
  uploadProductImages,
  uploadProductImagesController
);

export default router;