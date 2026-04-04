const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createMeeting, getMeetings, getMeetingByCode, getMeetingById,
  startMeeting, endMeeting, joinMeeting, updateTranscript,
  generateSummary, deleteMeeting,
} = require("../controllers/meetingController");

router.post("/", protect, createMeeting);
router.get("/", protect, getMeetings);
router.get("/join/:code", protect, joinMeeting);
router.get("/code/:code", protect, getMeetingByCode);
router.get("/:id", protect, getMeetingById);
router.put("/:id/start", protect, startMeeting);
router.put("/:id/end", protect, endMeeting);
router.put("/:id/transcript", protect, updateTranscript);
router.post("/:id/summary", protect, generateSummary);
router.delete("/:id", protect, deleteMeeting);

module.exports = router;
