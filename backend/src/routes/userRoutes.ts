import { Router } from "express";

import {
  getCustomers,
} from "../controllers/userController";

import {
  protect,
} from "../middleware/authMiddleware";

import {
  adminOnly,
} from "../middleware/roleMiddleware";


const router = Router();


/* =========================================================
   ADMIN — GET ALL CUSTOMERS
========================================================= */

router.get(
  "/customers",
  protect,
  adminOnly,
  getCustomers
);


export default router;