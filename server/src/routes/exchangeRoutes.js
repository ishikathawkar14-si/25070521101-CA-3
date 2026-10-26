import express from 'express';
import ExchangeRequest from '../models/ExchangeRequest.js';
import Skill from '../models/Skill.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create a skill exchange request
// @route   POST /api/exchanges
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { skillRequestedId, skillOffered, message, preferredMode, exchangeLocation } = req.body;

    if (!skillRequestedId || !skillOffered || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill requested, skill offered in return, and message',
      });
    }

    const skill = await Skill.findById(skillRequestedId).populate('user');
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Check if user is requesting their own skill
    if (skill.user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a skill exchange request to yourself',
      });
    }

    // Check if duplicate pending request already exists
    const existingPending = await ExchangeRequest.findOne({
      sender: req.user._id,
      receiver: skill.user._id,
      skillRequested: skill._id,
      status: 'pending',
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending request for this skill',
      });
    }

    const request = await ExchangeRequest.create({
      sender: req.user._id,
      receiver: skill.user._id,
      skillRequested: skill._id,
      skillOffered,
      message,
      preferredMode: preferredMode || 'Flexible / Chat First',
      exchangeLocation: exchangeLocation || '',
      status: 'pending',
    });

    const populatedRequest = await ExchangeRequest.findById(request._id)
      .populate('sender', 'name email avatar university major year contactInfo')
      .populate('receiver', 'name email avatar university major year contactInfo')
      .populate('skillRequested', 'title category level');

    res.status(201).json({
      success: true,
      message: 'Exchange request sent successfully!',
      request: populatedRequest,
    });
  } catch (error) {
    console.error('Create exchange error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user's received and sent exchange requests
// @route   GET /api/exchanges/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const received = await ExchangeRequest.find({ receiver: req.user._id })
      .populate('sender', 'name email avatar university major year bio contactInfo')
      .populate('receiver', 'name email avatar university major year contactInfo')
      .populate('skillRequested', 'title category level')
      .sort({ createdAt: -1 });

    const sent = await ExchangeRequest.find({ sender: req.user._id })
      .populate('sender', 'name email avatar university major year contactInfo')
      .populate('receiver', 'name email avatar university major year bio contactInfo')
      .populate('skillRequested', 'title category level')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      received,
      sent,
      counts: {
        receivedPending: received.filter(r => r.status === 'pending').length,
        receivedTotal: received.length,
        sentTotal: sent.length,
        acceptedTotal: [...received, ...sent].filter(r => r.status === 'accepted').length,
      },
    });
  } catch (error) {
    console.error('Fetch exchange requests error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update exchange request status (accept, reject, completed)
// @route   PUT /api/exchanges/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, responseNote, exchangeLocation } = req.body;

    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await ExchangeRequest.findById(req.params.id)
      .populate('sender', 'name email avatar university major contactInfo')
      .populate('receiver', 'name email avatar university major contactInfo')
      .populate('skillRequested', 'title category level');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    // Only receiver can accept or reject
    const isReceiver = request.receiver._id.toString() === req.user._id.toString();
    const isSender = request.sender._id.toString() === req.user._id.toString();

    if (['accepted', 'rejected'].includes(status) && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: 'Only the requested student can accept or decline this proposal',
      });
    }

    if (status === 'completed' && !isReceiver && !isSender) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exchange request',
      });
    }

    request.status = status;
    if (responseNote !== undefined) request.responseNote = responseNote;
    if (exchangeLocation !== undefined) request.exchangeLocation = exchangeLocation;

    await request.save();

    res.json({
      success: true,
      message: `Skill exchange request marked as ${status}`,
      request,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Cancel or delete an exchange request
// @route   DELETE /api/exchanges/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    const isSender = request.sender.toString() === req.user._id.toString();
    const isReceiver = request.receiver.toString() === req.user._id.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this request' });
    }

    await ExchangeRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Exchange request removed successfully',
      requestId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
