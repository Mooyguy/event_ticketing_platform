import express from "express";
import { getAllUsers, updateUserRole } from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, getAllUsers);
router.put("/:id/role", authenticateToken, requireAdmin, updateUserRole);

export default router;