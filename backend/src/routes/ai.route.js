import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { protectRoute } from "../middleware/auth.middleware.js";
import { chatWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

const keyByUser = (req, res) =>
  (req.user?._id && req.user._id.toString()) || ipKeyGenerator(req, res);

// Rate limits
const aiBurstLimiter = rateLimit({
  windowMs: 3_000, // 3 seconds
  limit: 1, // 1 request
  keyGenerator: keyByUser,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Please wait a couple seconds before your next AI request." },
});
const aiMinuteLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  limit: 10, // 10 requests
  keyGenerator: keyByUser,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI requests. Try again in a minute." },
});
const aiDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  limit: 50, // 50 requests
  keyGenerator: keyByUser,
  standardHeaders: true,
  legacyHeaders: false,
   message: { message: "Daily AI chat limit reached. Try again tomorrow." },
});

router.post(
  "/chat",
  protectRoute,
  aiBurstLimiter,
  aiMinuteLimiter,
  aiDailyLimiter,
  chatWithAI
);

export default router;
