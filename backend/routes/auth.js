const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ===========================
// POST /auth/register
// ===========================
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, username, email, password: hashedPassword });
    await user.save();

    console.log('User registered:', { id: user._id, email: user.email });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
});

// ===========================
// POST /auth/login (with debug logging)
// ===========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', { email, password }); // log incoming payload

  try {
    const user = await User.findOne({ email });
    console.log('User found in DB:', user); // log user found

    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch); // log bcrypt check

    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful, token generated');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error); // log unexpected errors
    res.status(500).json({ message: 'Login failed', error });
  }
});

// ===========================
// GET /auth/profile (protected)
// ===========================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ message: 'Failed to retrieve profile', error });
  }
});

module.exports = router;
