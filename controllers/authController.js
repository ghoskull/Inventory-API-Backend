const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  // Cek apakah user sudah ada
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400);
    throw new Error('Username already taken');
  }

  // Buat user baru
  const user = await User.create({ username, password });

  // Buat token JWT
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set cookie HTTP-only
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    sameSite: 'lax'
  });

  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, username: user.username }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  // Cari user
  const user = await User.findOne({ username });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Cek password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Buat token
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set cookie HTTP-only
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    sameSite: 'lax'
  });

  res.status(200).json({
    success: true,
    token,
    user: { id: user._id, username: user.username }
  });
});

module.exports = { register, login };