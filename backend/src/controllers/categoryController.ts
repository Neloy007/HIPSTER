import { Request, Response } from "express";
import {
  createCategory as createCategoryService,
  getActiveCategories,
  getCategoryBySlug,
  updateCategory as updateCategoryService,
  updateCategoryStatus,
  deleteCategory as deleteCategoryService,
} from "../services/categoryService";
import { AuthRequest } from "../middleware/authMiddleware";

export const createCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Category name is required",
      });
      return;
    }

    const category = await createCategoryService({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create category",
    });
  }
};

export const getCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await getActiveCategories();

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
    });
  }
};

export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid category slug",
      });
      return;
    }

    const category = await getCategoryBySlug(slug);

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Category not found",
    });
  }
};

export const updateCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const { name, description } = req.body;

    if (name === undefined && description === undefined) {
      res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
      return;
    }

    const category = await updateCategoryService(id, {
      name,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update category",
    });
  }
};

export const changeCategoryStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
      return;
    }

    const category = await updateCategoryStatus(id, isActive);

    res.status(200).json({
      success: true,
      message: `Category ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Change category status error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update category status",
    });
  }
};

export const deleteCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await deleteCategoryService(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete category",
    });
  }
};