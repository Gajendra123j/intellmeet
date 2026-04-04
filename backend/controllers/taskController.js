const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, assignee, meeting, priority, dueDate } = req.body;
    const task = await Task.create({
      title, description, assignee, meeting,
      priority, dueDate, createdBy: req.user.id,
    });
    await task.populate("assignee", "name email avatar");
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignee) filter.assignee = req.query.assignee;
    if (req.query.meeting) filter.meeting = req.query.meeting;
    if (req.query.status) filter.status = req.query.status;

    const tasks = await Task.find(filter)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("assignee", "name email avatar");
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
