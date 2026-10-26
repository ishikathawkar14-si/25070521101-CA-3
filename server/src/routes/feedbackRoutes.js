import express from 'express';
import Feedback, { FEEDBACK_CATEGORIES } from '../models/Feedback.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Submit feedback (guests allowed; signed-in students are linked to their account)
// @route   POST /api/feedback
// @access  Public (optional auth)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, category, rating, message } = req.body;

    // Signed-in students can leave name/email blank and their account details are used
    const cleanName = String(name || req.user?.name || '').trim();
    const cleanEmail = String(email || req.user?.email || '').trim().toLowerCase();
    const cleanCategory = category || 'General Feedback';
    const cleanMessage = String(message || '').trim();
    const numericRating =
      rating === undefined || rating === null || rating === '' ? null : Number(rating);

    if (!cleanName) {
      return res.status(400).json({ success: false, message: 'Please provide your name' });
    }

    if (cleanEmail && !EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    if (!FEEDBACK_CATEGORIES.includes(cleanCategory)) {
      return res.status(400).json({ success: false, message: 'Please choose a valid feedback category' });
    }

    if (
      numericRating !== null &&
      (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5)
    ) {
      return res.status(400).json({ success: false, message: 'Rating must be a whole number from 1 to 5' });
    }

    if (cleanMessage.length < 10) {
      return res.status(400).json({ success: false, message: 'Feedback message must be at least 10 characters long' });
    }

    if (cleanMessage.length > 1000) {
      return res.status(400).json({ success: false, message: 'Feedback message cannot exceed 1000 characters' });
    }

    const feedback = await Feedback.create({
      user: req.user?._id || null,
      name: cleanName,
      email: cleanEmail,
      category: cleanCategory,
      rating: numericRating,
      message: cleanMessage,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been saved.',
      feedback,
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get the feedback submitted by the logged-in student
// @route   GET /api/feedback/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error('Fetch feedback error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
