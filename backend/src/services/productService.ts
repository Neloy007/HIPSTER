import Product, { IProduct } from "../models/Product";
import Category from "../models/Category";
import { Types } from "mongoose";

/* =========================================================
   CREATE PRODUCT DATA
========================================================= */

export interface CreateProductData {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  sizes?: string[];
  colors?: {
    name: string;
    hex: string;
  }[];
  images?: string[];
  isFeatured?: boolean;
}

/* =========================================================
   UPDATE PRODUCT DATA
========================================================= */

export interface UpdateProductData {
  name?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: number;
  compareAtPrice?: number;
  sku?: string;
  stock?: number;
  sizes?: string[];
  colors?: {
    name: string;
    hex: string;
  }[];
  images?: string[];
  isFeatured?: boolean;
}

/* =========================================================
   GENERATE SLUG
========================================================= */

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/* =========================================================
   GENERATE UNIQUE SLUG
========================================================= */

const generateUniqueSlug = async (
  name: string,
  excludeProductId?: string
): Promise<string> => {
  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: {
      slug: string;
      _id?: { $ne: string };
    } = {
      slug,
    };

    if (excludeProductId) {
      query._id = {
        $ne: excludeProductId,
      };
    }

    const existingProduct = await Product.findOne(query);

    if (!existingProduct) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/* =========================================================
   VALIDATE CATEGORY
========================================================= */

const validateCategory = async (
  categoryId: string
): Promise<void> => {
  if (!Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    throw new Error(
      "Category not found or category is inactive"
    );
  }
};

/* =========================================================
   CREATE PRODUCT
========================================================= */

export const createProduct = async (
  data: CreateProductData
): Promise<IProduct> => {
  const {
    name,
    description,
    brand,
    category,
    price,
    compareAtPrice,
    sku,
    stock,
    sizes = [],
    colors = [],
    images = [],
    isFeatured = false,
  } = data;

  const trimmedName = name.trim();
  const normalizedSku = sku.trim().toUpperCase();

  /* -------------------------------------------------------
     VALIDATE CATEGORY
  ------------------------------------------------------- */

  await validateCategory(category);

  /* -------------------------------------------------------
     CHECK SKU
  ------------------------------------------------------- */

  const existingSku = await Product.findOne({
    sku: normalizedSku,
  });

  if (existingSku) {
    throw new Error(
      "A product with this SKU already exists"
    );
  }

  /* -------------------------------------------------------
     VALIDATE SALE PRICE
  ------------------------------------------------------- */

  if (
    compareAtPrice !== undefined &&
    compareAtPrice <= price
  ) {
    throw new Error(
      "Compare-at price must be greater than the current price"
    );
  }

  /* -------------------------------------------------------
     GENERATE SLUG
  ------------------------------------------------------- */

  const slug = await generateUniqueSlug(trimmedName);

  /* -------------------------------------------------------
     CREATE PRODUCT
  ------------------------------------------------------- */

  const product = await Product.create({
    name: trimmedName,
    slug,
    description: description.trim(),
    brand: brand.trim(),

    category: new Types.ObjectId(category),

    price,
    compareAtPrice,

    sku: normalizedSku,
    stock,

    sizes,
    colors,
    images,

    isFeatured,
    isActive: true,
  });

  return product;
};

/* =========================================================
   GET ALL ACTIVE PRODUCTS
========================================================= */

export const getActiveProducts = async (): Promise<IProduct[]> => {
  return Product.find({
    isActive: true,
  })
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });
};

/* =========================================================
   GET ALL PRODUCTS FOR ADMIN
========================================================= */

export const getAllProductsForAdmin = async (): Promise<IProduct[]> => {
  return Product.find({})
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });
};

/* =========================================================
   GET PRODUCT BY SLUG
========================================================= */

export const getProductBySlug = async (
  slug: string
): Promise<IProduct> => {
  const product = await Product.findOne({
    slug: slug.toLowerCase().trim(),
    isActive: true,
  }).populate("category", "name slug");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export const getProductById = async (
  productId: string
): Promise<IProduct> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  }).populate("category", "name slug");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export const updateProduct = async (
  productId: string,
  data: UpdateProductData
): Promise<IProduct> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  /* -------------------------------------------------------
     NAME
  ------------------------------------------------------- */

  if (data.name !== undefined) {
    const trimmedName = data.name.trim();

    if (!trimmedName) {
      throw new Error("Product name cannot be empty");
    }

    product.name = trimmedName;

    product.slug = await generateUniqueSlug(
      trimmedName,
      productId
    );
  }

  /* -------------------------------------------------------
     DESCRIPTION
  ------------------------------------------------------- */

  if (data.description !== undefined) {
    const description = data.description.trim();

    if (!description) {
      throw new Error(
        "Product description cannot be empty"
      );
    }

    product.description = description;
  }

  /* -------------------------------------------------------
     BRAND
  ------------------------------------------------------- */

  if (data.brand !== undefined) {
    const brand = data.brand.trim();

    if (!brand) {
      throw new Error("Product brand cannot be empty");
    }

    product.brand = brand;
  }

  /* -------------------------------------------------------
     CATEGORY
  ------------------------------------------------------- */

  if (data.category !== undefined) {
    await validateCategory(data.category);

    product.category = new Types.ObjectId(data.category);
  }

  /* -------------------------------------------------------
     PRICE
  ------------------------------------------------------- */

  if (data.price !== undefined) {
    if (data.price < 0) {
      throw new Error(
        "Product price cannot be negative"
      );
    }

    product.price = data.price;
  }

  /* -------------------------------------------------------
     COMPARE-AT PRICE
  ------------------------------------------------------- */

  if (data.compareAtPrice !== undefined) {
    if (data.compareAtPrice < 0) {
      throw new Error(
        "Compare-at price cannot be negative"
      );
    }

    product.compareAtPrice = data.compareAtPrice;
  }

  /* -------------------------------------------------------
     VALIDATE PRICE RELATIONSHIP
  ------------------------------------------------------- */

  if (
    product.compareAtPrice !== undefined &&
    product.compareAtPrice <= product.price
  ) {
    throw new Error(
      "Compare-at price must be greater than the current price"
    );
  }

  /* -------------------------------------------------------
     SKU
  ------------------------------------------------------- */

  if (data.sku !== undefined) {
    const normalizedSku = data.sku
      .trim()
      .toUpperCase();

    if (!normalizedSku) {
      throw new Error("Product SKU cannot be empty");
    }

    const existingSku = await Product.findOne({
      sku: normalizedSku,
      _id: {
        $ne: productId,
      },
    });

    if (existingSku) {
      throw new Error(
        "A product with this SKU already exists"
      );
    }

    product.sku = normalizedSku;
  }

  /* -------------------------------------------------------
     STOCK
  ------------------------------------------------------- */

  if (data.stock !== undefined) {
    if (data.stock < 0) {
      throw new Error(
        "Product stock cannot be negative"
      );
    }

    product.stock = data.stock;
  }

  /* -------------------------------------------------------
     SIZES
  ------------------------------------------------------- */

  if (data.sizes !== undefined) {
    product.sizes = data.sizes
      .map((size) => size.trim())
      .filter(Boolean);
  }

  /* -------------------------------------------------------
     COLORS
  ------------------------------------------------------- */

  if (data.colors !== undefined) {
    product.colors = data.colors;
  }

  /* -------------------------------------------------------
     IMAGES
  ------------------------------------------------------- */

  if (data.images !== undefined) {
    product.images = data.images
      .map((image) => image.trim())
      .filter(Boolean);
  }

  /* -------------------------------------------------------
     FEATURED STATUS
  ------------------------------------------------------- */

  if (data.isFeatured !== undefined) {
    product.isFeatured = data.isFeatured;
  }

  /* -------------------------------------------------------
     SAVE
  ------------------------------------------------------- */

  await product.save();

  return product;
};

/* =========================================================
   UPDATE PRODUCT STATUS
========================================================= */

export const updateProductStatus = async (
  productId: string,
  isActive: boolean
): Promise<IProduct> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  product.isActive = isActive;

  await product.save();

  return product;
};

/* =========================================================
   DELETE PRODUCT
========================================================= */

export const deleteProduct = async (
  productId: string
): Promise<IProduct> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Soft delete.
  // Keep the product in MongoDB but deactivate it.
  product.isActive = false;

  await product.save();

  return product;
};