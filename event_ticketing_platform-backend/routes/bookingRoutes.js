import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
} from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateBooking } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllBookings);
router.get("/user/:userId", authenticateToken, getBookingsByUser);
router.post("/", authenticateToken, validateBooking, createBooking);

export default router;