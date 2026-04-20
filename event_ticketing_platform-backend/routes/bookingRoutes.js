import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
} from "../controllers/bookingController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, getAllBookings);
router.get("/user/:userId", authenticateToken, getBookingsByUser);
router.post("/", authenticateToken, createBooking);

export default router;