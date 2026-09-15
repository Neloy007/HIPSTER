import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Security middleware
app.use(helmet());

// Allow frontend applications to communicate with the API
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "HIPSTER API is running 🚀",
  });
});

export default app;