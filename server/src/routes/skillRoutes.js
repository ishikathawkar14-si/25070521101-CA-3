import express from 'express';
import Skill from '../models/Skill.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all skills with optional search, category, and level filtering
// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, level, mode, type } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (mode && mode !== 'All') {
      query.mode = mode;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { wantedSkills: searchRegex },
      ];
    }

    const skills = await Skill.find(query)
      .populate('user', 'name email avatar university major year bio skillsTeaching skillsLearning contactInfo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error('Fetch skills error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user's listed skills
// @route   GET /api/skills/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id })
      .populate('user', 'name avatar university major')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      skills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get skill by ID
// @route   GET /api/skills/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('user', 'name email avatar university major year bio skillsTeaching skillsLearning contactInfo');

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, category, level, type, description, syllabus, wantedSkills, mode, availability } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill title, category, and description',
      });
    }

    const skill = await Skill.create({
      title,
      category,
      level: level || 'Beginner',
      type: type === 'wanted' ? 'wanted' : 'offered',
      description,
      syllabus: Array.isArray(syllabus) ? syllabus : (syllabus ? syllabus.split(',').map(s => s.trim()) : []),
      wantedSkills: Array.isArray(wantedSkills) ? wantedSkills : (wantedSkills ? wantedSkills.split(',').map(s => s.trim()) : []),
      mode: mode || 'Flexible / Hybrid',
      availability: availability || 'Flexible schedule',
      user: req.user._id,
    });

    // Sync into user profile skillsTeaching list
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { skillsTeaching: title },
    });

    const populatedSkill = await Skill.findById(skill._id).populate('user', 'name avatar university major');

    res.status(201).json({
      success: true,
      message: 'Skill posted successfully!',
      skill: populatedSkill,
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Check ownership
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this skill' });
    }

    const { title, category, level, type, description, syllabus, wantedSkills, mode, availability } = req.body;

    if (title) skill.title = title;
    if (category) skill.category = category;
    if (level) skill.level = level;
    if (type) skill.type = type;
    if (description) skill.description = description;
    if (syllabus) skill.syllabus = Array.isArray(syllabus) ? syllabus : syllabus.split(',').map(s => s.trim());
    if (wantedSkills) skill.wantedSkills = Array.isArray(wantedSkills) ? wantedSkills : wantedSkills.split(',').map(s => s.trim());
    if (mode) skill.mode = mode;
    if (availability) skill.availability = availability;

    const updatedSkill = await skill.save();
    const populated = await Skill.findById(updatedSkill._id).populate('user', 'name avatar university major');

    res.json({
      success: true,
      message: 'Skill updated successfully',
      skill: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this skill' });
    }

    await Skill.findByIdAndDelete(req.params.id);

    // Remove from user skillsTeaching
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { skillsTeaching: skill.title },
    });

    res.json({
      success: true,
      message: 'Skill deleted successfully',
      skillId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
