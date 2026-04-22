import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import externalEventRoutes from "./routes/externalEventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { seedAdminUser } from "./utils/seedAdmin.js";
import merchOrderRoutes from "./routes/merchOrderRoutes.js";
import merchandiseRoutes from "./routes/merchandiseRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";



dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/external-events", externalEventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/merch-orders", merchOrderRoutes);
app.use("/api/merchandise", merchandiseRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5001;
await seedAdminUser();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});