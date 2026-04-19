import express from "express";
import { getRecommendedEvents } from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/:eventId", getRecommendedEvents);

export default router;