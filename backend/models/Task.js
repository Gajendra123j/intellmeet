const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
