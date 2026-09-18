import Category, { ICategory } from "../models/Category";

interface CreateCategoryData {
  name: string;
  description?: string;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const createCategory = async (
  data: CreateCategoryData
): Promise<ICategory> => {
  const name = data.name.trim();
  const slug = generateSlug(name);

  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    throw new Error("A category with this name already exists");
  }

  const category = await Category.create({
    name,
    slug,
    description: data.description?.trim(),
  });

  return category;
};

export const getActiveCategories = async (): Promise<ICategory[]> => {
  return Category.find({ isActive: true }).sort({ name: 1 });
};

export const getCategoryBySlug = async (
  slug: string
): Promise<ICategory> => {
  const category = await Category.findOne({
    slug: slug.toLowerCase().trim(),
    isActive: true,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategory = async (
  categoryId: string,
  data: UpdateCategoryData
): Promise<ICategory> => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  if (data.name !== undefined) {
    const name = data.name.trim();

    const newSlug = generateSlug(name);

    const existingCategory = await Category.findOne({
      _id: { $ne: categoryId },
      $or: [{ name }, { slug: newSlug }],
    });

    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }

    category.name = name;
    category.slug = newSlug;
  }

  if (data.description !== undefined) {
    category.description = data.description.trim();
  }

  await category.save();

  return category;
};

export const updateCategoryStatus = async (
  categoryId: string,
  isActive: boolean
): Promise<ICategory> => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  category.isActive = isActive;

  await category.save();

  return category;
};

export const deleteCategory = async (
  categoryId: string
): Promise<ICategory> => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  // Soft delete: keep the document but deactivate it.
  category.isActive = false;

  await category.save();

  return category;
};