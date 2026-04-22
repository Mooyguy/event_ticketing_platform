import express from "express";
import {
  createMerchOrder,
  getMerchOrdersByUser,
  getAllMerchOrders,
} from "../controllers/merchOrderController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createMerchOrder);
router.get("/", authenticateToken, requireAdmin, getAllMerchOrders);
router.get("/user/:userId", authenticateToken, getMerchOrdersByUser);

export default router;