import express from "express";
import {
  getBookingsPerEvent,
  getTopEvents,
  getOverallStats,
} from "../controllers/analyticsController.js";

import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/bookings-per-event", authenticateToken, requireAdmin, getBookingsPerEvent);

router.get("/top-events", authenticateToken, requireAdmin, getTopEvents);

router.get("/overview", authenticateToken, requireAdmin, getOverallStats);

export default router;