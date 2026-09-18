import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

/* =========================================================
   PRODUCT COLOR
========================================================= */

export interface IProductColor {
  name: string;
  hex: string;
}

/* =========================================================
   PRODUCT INTERFACE
========================================================= */

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  brand: string;

  category: Types.ObjectId;

  price: number;
  compareAtPrice?: number;

  sku: string;
  stock: number;

  sizes: string[];

  colors: IProductColor[];

  images: string[];

  isFeatured: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   COLOR SCHEMA
========================================================= */

const productColorSchema = new Schema<IProductColor>(
  {
    name: {
      type: String,
      required: [true, "Color name is required"],
      trim: true,
      maxlength: [
        30,
        "Color name cannot exceed 30 characters",
      ],
    },

    hex: {
      type: String,
      required: [true, "Color hex value is required"],
      trim: true,
      uppercase: true,
      match: [
        /^#[0-9A-F]{6}$/,
        "Color must be a valid hex value",
      ],
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   PRODUCT SCHEMA
========================================================= */

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [
        2,
        "Product name must be at least 2 characters long",
      ],
      maxlength: [
        150,
        "Product name cannot exceed 150 characters",
      ],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [
        2000,
        "Product description cannot exceed 2000 characters",
      ],
    },

    brand: {
      type: String,
      required: [true, "Product brand is required"],
      trim: true,
      maxlength: [
        100,
        "Product brand cannot exceed 100 characters",
      ],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
      index: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [
        0,
        "Product price cannot be negative",
      ],
    },

    compareAtPrice: {
      type: Number,
      min: [
        0,
        "Compare-at price cannot be negative",
      ],
    },

    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [
        50,
        "Product SKU cannot exceed 50 characters",
      ],
      index: true,
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [
        0,
        "Product stock cannot be negative",
      ],
      default: 0,
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [productColorSchema],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   PRODUCT VALIDATION
========================================================= */

productSchema.pre("validate", function () {
  if (
    this.compareAtPrice !== undefined &&
    this.compareAtPrice !== null &&
    this.compareAtPrice <= this.price
  ) {
    this.invalidate(
      "compareAtPrice",
      "Compare-at price must be greater than the current price"
    );
  }
});

/* =========================================================
   PRODUCT INDEXES
========================================================= */

/*
   Search products by:
   - name
   - brand
   - SKU
*/
productSchema.index({
  name: "text",
  brand: "text",
  sku: "text",
});

/*
   Category filtering
*/
productSchema.index({
  category: 1,
  isActive: 1,
});

/*
   Featured products
*/
productSchema.index({
  isFeatured: 1,
  isActive: 1,
});

/*
   Newest products
*/
productSchema.index({
  createdAt: -1,
});

/* =========================================================
   PRODUCT MODEL
========================================================= */

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;