import express from "express";
import {
  checkoutOrder,
  getOrdersByUser,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", authenticateToken, checkoutOrder);
router.get("/user/:userId", authenticateToken, getOrdersByUser);

export default router;