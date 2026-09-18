import { Router } from "express";

import {
  createProduct,
  getProducts,
  getAdminProducts,
  getProduct,
  getProductDetails,
  updateProduct,
  changeProductStatus,
  deleteProduct,
} from "../controllers/productController";

import { protect } from "../middleware/authMiddleware";

import { adminOnly } from "../middleware/roleMiddleware";

const router = Router();

/* =========================================================
   PUBLIC PRODUCT ROUTES
========================================================= */

// Get all active products

router.get(
  "/",
  getProducts
);

// Get a single active product by slug

router.get(
  "/slug/:slug",
  getProduct
);

/* =========================================================
   ADMIN PRODUCT ROUTES
========================================================= */

// Get all products including inactive products

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminProducts
);

/* =========================================================
   PUBLIC PRODUCT ROUTE
========================================================= */

// Get a single active product by ID

router.get(
  "/:id",
  getProductDetails
);

/* =========================================================
   ADMIN PRODUCT ROUTES
========================================================= */

// Create product

router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

// Update product

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// Activate / deactivate product

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  changeProductStatus
);

// Soft-delete product

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;