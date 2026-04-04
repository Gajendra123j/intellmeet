const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { register, login, refresh, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.post("/refresh", refresh);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
