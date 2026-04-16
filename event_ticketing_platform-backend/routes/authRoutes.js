import express from "express";
import { register, login } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";
import { validateLogin, validateRegister } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);

export default router;