const Meeting = require("../models/Meeting");
const { generateAISummary } = require("../utils/aiHelper");

const createMeeting = async (req, res) => {
  try {
    const { title, description, scheduledAt } = req.body;
    const meeting = await Meeting.create({
      title,
      description,
      scheduledAt,
      host: req.user.id,
      participants: [req.user.id],
    });
    await meeting.populate("host", "name email avatar");
    res.status(201).json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ host: req.user.id }, { participants: req.user.id }],
    })
      .populate("host", "name email avatar")
      .populate("participants", "name email avatar")
      .sort({ createdAt: -1 });
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMeetingByCode = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingCode: req.params.code })
      .populate("host", "name email avatar")
      .populate("participants", "name email avatar");
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("host", "name email avatar")
      .populate("participants", "name email avatar");
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const startMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    if (meeting.host.toString() !== req.user.id)
      return res.status(403).json({ message: "Only host can start meeting" });

    meeting.status = "active";
    meeting.startedAt = new Date();
    await meeting.save();
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const endMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    meeting.status = "ended";
    meeting.endedAt = new Date();
    if (meeting.startedAt) {
      meeting.duration = Math.round((meeting.endedAt - meeting.startedAt) / 60000);
    }

    // Generate AI summary if transcript exists
    if (meeting.transcript && process.env.OPENAI_API_KEY) {
      try {
        const { summary, actionItems } = await generateAISummary(meeting.transcript);
        meeting.summary = summary;
        meeting.actionItems = actionItems;
      } catch (e) {
        console.error("AI summary failed:", e.message);
      }
    }

    await meeting.save();
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const joinMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingCode: req.params.code });
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    if (meeting.status === "ended")
      return res.status(400).json({ message: "Meeting has ended" });

    if (!meeting.participants.includes(req.user.id)) {
      meeting.participants.push(req.user.id);
      await meeting.save();
    }

    await meeting.populate("host", "name email avatar");
    await meeting.populate("participants", "name email avatar");
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { $set: { transcript } },
      { new: true }
    );
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const generateSummary = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    if (!meeting.transcript)
      return res.status(400).json({ message: "No transcript available" });

    const { summary, actionItems } = await generateAISummary(meeting.transcript);
    meeting.summary = summary;
    meeting.actionItems = actionItems;
    await meeting.save();

    res.json({ success: true, summary, actionItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    if (meeting.host.toString() !== req.user.id)
      return res.status(403).json({ message: "Only host can delete meeting" });

    await meeting.deleteOne();
    res.json({ success: true, message: "Meeting deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMeeting, getMeetings, getMeetingByCode, getMeetingById,
  startMeeting, endMeeting, joinMeeting, updateTranscript,
  generateSummary, deleteMeeting,
};
