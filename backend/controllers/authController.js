const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
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

    // Create mock user + REAL DB user
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create DB user first
    const dbUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "member",
      avatar: "",
      isOnline: true
    });
    
    // Sync mock
    const userId = dbUser._id.toString();
    const newUser = {
      _id: userId,
      name: dbUser.name,
      email: dbUser.email,
      password: hashedPassword,
      role: dbUser.role,
      avatar: dbUser.avatar,
      refreshToken: "",
      isOnline: true
    };
    mockUsers.push(newUser);
    
    console.log('✅ DB+Mock user created:', userId);
    
    const { accessToken, refreshToken } = generateTokens(userId);
    newUser.refreshToken = refreshToken;
    await dbUser.updateOne({ refreshToken });

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: userId, name: dbUser.name, email: dbUser.email, role: dbUser.role, avatar: dbUser.avatar },
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
    
    // Check DB first
    let dbUser = await User.findOne({ email }).select('+password');
    let user;
    
    if (!dbUser) {
      // Fallback to mock (backward compat)
      user = mockUsers.find(u => u.email === email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      // Create DB user on first login
      dbUser = await User.create({
        name: user.name,
        email,
        password: user.password,
        role: user.role,
        avatar: user.avatar || "",
        isOnline: true
      });
      user._id = dbUser._id.toString();
    } else if (!(await dbUser.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    user = mockUsers.find(u => u._id === dbUser._id.toString()) || {
      _id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      avatar: dbUser.avatar,
      password: '', // not stored
      refreshToken: '',
      isOnline: true
    };
    
    const { accessToken, refreshToken } = generateTokens(dbUser._id.toString());
    user.refreshToken = refreshToken;
    user.isOnline = true;
    await dbUser.updateOne({ refreshToken, isOnline: true });
    
    console.log('✅ DB+Mock login success:', dbUser._id);
    
    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: dbUser._id.toString(), name: dbUser.name, email: dbUser.email, role: dbUser.role, avatar: dbUser.avatar },
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
  if (user) {
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    return;
  }
  // Fallback to DB
  const dbUser = await User.findById(req.user.id).select('-password -refreshToken');
  if (!dbUser) return res.status(404).json({ message: "User not found" });
  res.json({ success: true, user: { id: dbUser._id, name: dbUser.name, email: dbUser.email, role: dbUser.role, avatar: dbUser.avatar } });
};

const logout = async (req, res) => {
  const user = mockUsers.find(u => u._id === req.user.id);
  if (user) {
    user.refreshToken = "";
    user.isOnline = false;
  }
  await User.findByIdAndUpdate(req.user.id, { refreshToken: "", isOnline: false });
  res.json({ success: true, message: "Logged out" });
};

module.exports = { register, login, refresh, getMe, logout };
