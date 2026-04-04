const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateTokens } = require("../utils/jwt");

// Mock users for development (no DB needed)
const mockUsers = [
  {
    _id: "demo1",
    name: "Demo User",
    email: "demo@intellmeet.ai",
    password: "$2a$12$3XJ6x6X6X6X6X6X6X6X6X6u6X6X6X6X6X6X6X6X6X6X6X6X6X6X6X", // "demo123"
    role: "member",
    avatar: "",
    refreshToken: "",
    isOnline: false
  }
];

const register = async (req, res) => {
  try {
    console.log('🔍 REGISTER START:', req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Check existing
    const existing = mockUsers.find(u => u.email === email);
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Create mock user
    const userId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      _id: userId,
      name,
      email,
      password: hashedPassword,
      role: "member",
      avatar: "",
      refreshToken: "",
      isOnline: true
    };

    mockUsers.push(newUser);
    console.log('✅ Mock user created:', userId);

    const { accessToken, refreshToken } = generateTokens(userId);
    newUser.refreshToken = refreshToken;

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: userId, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar },
    });
  } catch (err) {
    console.error('❌ REGISTER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    console.log('🔍 LOGIN:', req.body.email);
    const { email, password } = req.body;
    const user = mockUsers.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    user.isOnline = true;
    console.log('✅ Mock login success:', user._id);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    console.error('❌ LOGIN ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = mockUsers.find(u => u._id === decoded.id);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;

    res.json({ success: true, ...tokens });
  } catch {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

const getMe = async (req, res) => {
  const user = mockUsers.find(u => u._id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ success: true, user });
};

const logout = async (req, res) => {
  const user = mockUsers.find(u => u._id === req.user.id);
  if (user) {
    user.refreshToken = "";
    user.isOnline = false;
  }
  res.json({ success: true, message: "Logged out" });
};

module.exports = { register, login, refresh, getMe, logout };
