import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  deleteBooking,
  addTicketsToExistingBooking,

} from "../controllers/bookingController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, getAllBookings);
router.get("/user/:userId", authenticateToken, getBookingsByUser);
router.post("/", authenticateToken, createBooking);
router.delete("/:id", authenticateToken, requireAdmin, deleteBooking);
router.put("/:id/add-tickets", authenticateToken, addTicketsToExistingBooking);


export default router;