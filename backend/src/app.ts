import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";

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

export default app;