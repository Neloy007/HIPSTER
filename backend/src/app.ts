import express from "express";

import cors from "cors";

import helmet from "helmet";

import path from "path";

import authRoutes from "./routes/authRoutes";

import categoryRoutes from "./routes/categoryRoutes";

import productRoutes from "./routes/productRoutes";

import uploadRoutes from "./routes/uploadRoutes";

import userRoutes from "./routes/userRoutes";

const app = express();

/* =========================================================
   SECURITY MIDDLEWARE
========================================================= */

app.use(helmet());

app.use(cors());

/* =========================================================
   BODY PARSER
========================================================= */

app.use(express.json());

/* =========================================================
   ADMIN FRONTEND
========================================================= */

app.use(
  "/admin",
  express.static(
    path.join(__dirname, "../../admin")
  )
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (_req, res) => {

  res.status(200).json({

    success: true,

    message: "HIPSTER API is running 🚀",

  });

});

/* =========================================================
   AUTHENTICATION ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

/* =========================================================
   CATEGORY ROUTES
========================================================= */

app.use("/api/categories", categoryRoutes);

/* =========================================================
   PRODUCT ROUTES
========================================================= */

app.use("/api/products", productRoutes);

/* =========================================================
   UPLOAD ROUTES
========================================================= */

app.use("/api/upload", uploadRoutes);

/* =========================================================
   USER ROUTES
========================================================= */

app.use("/api/users", userRoutes);

export default app;