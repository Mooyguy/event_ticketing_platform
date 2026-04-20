import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post("/", authenticateToken, requireAdmin, createEvent);
router.put("/:id", authenticateToken, requireAdmin, updateEvent);
router.delete("/:id", authenticateToken, requireAdmin, deleteEvent);

export default router;