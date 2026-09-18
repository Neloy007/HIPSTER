import { Request, Response } from "express";

import {
  createProduct as createProductService,
  getActiveProducts,
  getAllProductsForAdmin,
  getProductBySlug,
  getProductById,
  updateProduct as updateProductService,
  updateProductStatus,
  deleteProduct as deleteProductService,
  CreateProductData,
  UpdateProductData,
} from "../services/productService";

import { AuthRequest } from "../middleware/authMiddleware";

/* =========================================================
   CREATE PRODUCT
========================================================= */

export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      compareAtPrice,
      sku,
      stock,
      sizes,
      colors,
      images,
      isFeatured,
    } = req.body;

    /* -------------------------------------------------------
       REQUIRED FIELDS
    ------------------------------------------------------- */

    if (
      !name ||
      !description ||
      !brand ||
      !category ||
      price === undefined ||
      !sku ||
      stock === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "Name, description, brand, category, price, SKU, and stock are required",
      });

      return;
    }

    /* -------------------------------------------------------
       NUMBER VALIDATION
    ------------------------------------------------------- */

    if (
      typeof price !== "number" ||
      Number.isNaN(price)
    ) {
      res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });

      return;
    }

    if (
      typeof stock !== "number" ||
      Number.isNaN(stock)
    ) {
      res.status(400).json({
        success: false,
        message: "Stock must be a valid number",
      });

      return;
    }

    if (price < 0) {
      res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });

      return;
    }

    if (stock < 0) {
      res.status(400).json({
        success: false,
        message: "Stock cannot be negative",
      });

      return;
    }

    /* -------------------------------------------------------
       COMPARE-AT PRICE VALIDATION
    ------------------------------------------------------- */

    if (
      compareAtPrice !== undefined &&
      (
        typeof compareAtPrice !== "number" ||
        Number.isNaN(compareAtPrice)
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Compare-at price must be a valid number",
      });

      return;
    }

    /* -------------------------------------------------------
       ARRAY VALIDATION
    ------------------------------------------------------- */

    if (
      sizes !== undefined &&
      !Array.isArray(sizes)
    ) {
      res.status(400).json({
        success: false,
        message: "Sizes must be an array",
      });

      return;
    }

    if (
      colors !== undefined &&
      !Array.isArray(colors)
    ) {
      res.status(400).json({
        success: false,
        message: "Colors must be an array",
      });

      return;
    }

    if (
      images !== undefined &&
      !Array.isArray(images)
    ) {
      res.status(400).json({
        success: false,
        message: "Images must be an array",
      });

      return;
    }

    /* -------------------------------------------------------
       CREATE DATA
    ------------------------------------------------------- */

    const productData: CreateProductData = {
      name,
      description,
      brand,
      category,
      price,
      compareAtPrice,
      sku,
      stock,
      sizes,
      colors,
      images,
      isFeatured,
    };

    const product =
      await createProductService(productData);

    /* -------------------------------------------------------
       RESPONSE
    ------------------------------------------------------- */

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create product",
    });
  }
};

/* =========================================================
   GET ALL ACTIVE PRODUCTS
========================================================= */

export const getProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await getActiveProducts();

    res.status(200).json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

/* =========================================================
   GET ALL PRODUCTS FOR ADMIN
========================================================= */

export const getAdminProducts = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const products = await getAllProductsForAdmin();

    res.status(200).json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Get admin products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

/* =========================================================
   GET PRODUCT BY SLUG
========================================================= */

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid product slug",
      });

      return;
    }

    const product = await getProductBySlug(slug);

    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Product not found",
    });
  }
};

/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export const getProductDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });

      return;
    }

    const product = await getProductById(id);

    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Get product by ID error:", error);

    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Product not found",
    });
  }
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });

      return;
    }

    const {
      name,
      description,
      brand,
      category,
      price,
      compareAtPrice,
      sku,
      stock,
      sizes,
      colors,
      images,
      isFeatured,
    } = req.body;

    /* -------------------------------------------------------
       AT LEAST ONE FIELD
    ------------------------------------------------------- */

    if (
      name === undefined &&
      description === undefined &&
      brand === undefined &&
      category === undefined &&
      price === undefined &&
      compareAtPrice === undefined &&
      sku === undefined &&
      stock === undefined &&
      sizes === undefined &&
      colors === undefined &&
      images === undefined &&
      isFeatured === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "At least one field is required for update",
      });

      return;
    }

    /* -------------------------------------------------------
       NUMBER VALIDATION
    ------------------------------------------------------- */

    if (
      price !== undefined &&
      (
        typeof price !== "number" ||
        Number.isNaN(price)
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });

      return;
    }

    if (
      stock !== undefined &&
      (
        typeof stock !== "number" ||
        Number.isNaN(stock)
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Stock must be a valid number",
      });

      return;
    }

    if (
      compareAtPrice !== undefined &&
      (
        typeof compareAtPrice !== "number" ||
        Number.isNaN(compareAtPrice)
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Compare-at price must be a valid number",
      });

      return;
    }

    /* -------------------------------------------------------
       ARRAY VALIDATION
    ------------------------------------------------------- */

    if (
      sizes !== undefined &&
      !Array.isArray(sizes)
    ) {
      res.status(400).json({
        success: false,
        message: "Sizes must be an array",
      });

      return;
    }

    if (
      colors !== undefined &&
      !Array.isArray(colors)
    ) {
      res.status(400).json({
        success: false,
        message: "Colors must be an array",
      });

      return;
    }

    if (
      images !== undefined &&
      !Array.isArray(images)
    ) {
      res.status(400).json({
        success: false,
        message: "Images must be an array",
      });

      return;
    }

    /* -------------------------------------------------------
       UPDATE DATA
    ------------------------------------------------------- */

    const updateData: UpdateProductData = {
      name,
      description,
      brand,
      category,
      price,
      compareAtPrice,
      sku,
      stock,
      sizes,
      colors,
      images,
      isFeatured,
    };

    const product =
      await updateProductService(id, updateData);

    /* -------------------------------------------------------
       RESPONSE
    ------------------------------------------------------- */

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update product",
    });
  }
};

/* =========================================================
   CHANGE PRODUCT STATUS
========================================================= */

export const changeProductStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
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

    const product = await updateProductStatus(
      id,
      isActive
    );

    res.status(200).json({
      success: true,
      message: `Product ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error(
      "Change product status error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update product status",
    });
  }
};

/* =========================================================
   DELETE PRODUCT
========================================================= */

export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });

      return;
    }

    const product =
      await deleteProductService(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete product",
    });
  }
};