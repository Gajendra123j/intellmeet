const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { updateProfile, getProfile, getAllUsers } = require("../controllers/profileController");
const { uploadAvatar } = require("../config/cloudinary");

router.get("/", protect, getProfile);
router.put("/", protect, uploadAvatar.single("avatar"), updateProfile);
router.get("/users", protect, getAllUsers);

module.exports = router;
