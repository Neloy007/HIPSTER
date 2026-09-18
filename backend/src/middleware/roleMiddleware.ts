import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";
import { UserRole } from "../models/User";

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== UserRole.ADMIN) {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
    return;
  }

  next();
};