import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  changeCategoryStatus,
  deleteCategory,
} from "../controllers/categoryController";
import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/roleMiddleware";

const router = Router();

// Public routes
router.get("/", getCategories);
router.get("/:slug", getCategory);

// Admin-only routes
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  changeCategoryStatus
);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;