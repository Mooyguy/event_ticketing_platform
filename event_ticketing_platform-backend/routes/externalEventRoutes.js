import express from "express";
import { searchExternalEvents } from "../controllers/externalEventController.js";

const router = express.Router();

router.get("/search", searchExternalEvents);

export default router;