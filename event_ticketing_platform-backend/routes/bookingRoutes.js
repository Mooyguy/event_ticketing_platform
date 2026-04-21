import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  deleteBooking,
} from "../controllers/bookingController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, getAllBookings);
router.get("/user/:userId", authenticateToken, getBookingsByUser);
router.post("/", authenticateToken, createBooking);
router.delete("/:id", authenticateToken, requireAdmin, deleteBooking);


export default router;