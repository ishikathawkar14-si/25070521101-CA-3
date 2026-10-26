import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_skillswap_jwt_key_2026_campus', {
    expiresIn: '30d',
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, university, major, year, bio, skillsTeaching, skillsLearning } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A student account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      university: university || 'Campus University',
      major: major || 'Computer Science',
      year: year || 'Sophomore',
      bio: bio || 'Eager student ready to share skills and learn from campus peers!',
      skillsTeaching: Array.isArray(skillsTeaching) ? skillsTeaching : (skillsTeaching ? [skillsTeaching] : []),
      skillsLearning: Array.isArray(skillsLearning) ? skillsLearning : (skillsLearning ? [skillsLearning] : []),
    });

    const token = generateToken(user._id);

    // Set secure HttpOnly cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        year: user.year,
        bio: user.bio,
        avatar: user.avatar,
        skillsTeaching: user.skillsTeaching,
        skillsLearning: user.skillsLearning,
        contactInfo: user.contactInfo,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
});

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    // Set secure HttpOnly cookie
    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        year: user.year,
        bio: user.bio,
        avatar: user.avatar,
        skillsTeaching: user.skillsTeaching,
        skillsLearning: user.skillsLearning,
        contactInfo: user.contactInfo,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
});

// @desc    Logout student
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current student user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const {
      name,
      university,
      major,
      year,
      bio,
      avatar,
      skillsTeaching,
      skillsLearning,
      contactInfo,
    } = req.body;

    if (name) user.name = name;
    if (university) user.university = university;
    if (major) user.major = major;
    if (year) user.year = year;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (skillsTeaching) user.skillsTeaching = skillsTeaching;
    if (skillsLearning) user.skillsLearning = skillsLearning;
    if (contactInfo) user.contactInfo = { ...user.contactInfo, ...contactInfo };

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get public profile of another student
// @route   GET /api/auth/users/:id
// @access  Public
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const userSkills = await Skill.find({ user: user._id });

    res.json({
      success: true,
      user,
      skills: userSkills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
