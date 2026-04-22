import express from "express";
import {
  getAllMerchandise,
  getMerchandiseByEvent,
  getRecommendedMerchandise,
  getMerchandiseById,
  createMerchandise,
  updateMerchandise,
  deleteMerchandise,
} from "../controllers/merchandiseController.js";
import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllMerchandise);
router.get("/event/:eventId", getMerchandiseByEvent);
router.get("/recommended/:category", getRecommendedMerchandise);
router.get("/:id", getMerchandiseById);

router.post("/", authenticateToken, requireAdmin, createMerchandise);
router.put("/:id", authenticateToken, requireAdmin, updateMerchandise);
router.delete("/:id", authenticateToken, requireAdmin, deleteMerchandise);

export default router;