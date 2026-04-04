const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const actionItemSchema = new mongoose.Schema({
  task: String,
  assignee: String,
  dueDate: Date,
  status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
});

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    meetingCode: { type: String, unique: true, default: () => uuidv4().slice(0, 8).toUpperCase() },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    scheduledAt: { type: Date },
    startedAt: { type: Date },
    endedAt: { type: Date },
    status: { type: String, enum: ["scheduled", "active", "ended"], default: "scheduled" },
    description: { type: String, default: "" },
    transcript: { type: String, default: "" },
    summary: { type: String, default: "" },
    actionItems: [actionItemSchema],
    chatMessages: [messageSchema],
    recordingUrl: { type: String, default: "" },
    duration: { type: Number, default: 0 }, // in minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
