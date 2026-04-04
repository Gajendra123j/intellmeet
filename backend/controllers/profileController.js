const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (req.file) updateData.avatar = req.file.path; // Cloudinary URL

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({}, "name email avatar isOnline lastSeen");
  res.json({ success: true, users });
};

module.exports = { updateProfile, getProfile, getAllUsers };
