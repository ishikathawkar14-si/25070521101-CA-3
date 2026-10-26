import express from 'express';
import Skill from '../models/Skill.js';
import User from '../models/User.js';
import ExchangeRequest from '../models/ExchangeRequest.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get platform global stats
// @route   GET /api/stats/overview
// @access  Public
router.get('/overview', async (req, res) => {
  try {
    const totalSkills = await Skill.countDocuments();
    const totalStudents = await User.countDocuments();
    const totalExchanges = await ExchangeRequest.countDocuments({ status: 'accepted' });
    const pendingExchanges = await ExchangeRequest.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalSkills,
        totalStudents,
        totalExchanges,
        pendingExchanges,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get personalized student dashboard metrics & intelligent exchange matches
// @route   GET /api/stats/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    // User's own skills
    const mySkills = await Skill.find({ user: userId });

    // Requests received by user
    const receivedRequests = await ExchangeRequest.find({ receiver: userId })
      .populate('sender', 'name avatar university major')
      .populate('skillRequested', 'title category')
      .sort({ createdAt: -1 });

    // Requests sent by user
    const sentRequests = await ExchangeRequest.find({ sender: userId })
      .populate('receiver', 'name avatar university major')
      .populate('skillRequested', 'title category')
      .sort({ createdAt: -1 });

    const activeExchanges = [
      ...receivedRequests.filter(r => r.status === 'accepted'),
      ...sentRequests.filter(r => r.status === 'accepted'),
    ];

    // Intelligent matchmaking algorithm:
    // Find skills taught by OTHER students that match what the current user wants to learn,
    // OR where the other student wants to learn what current user teaches!
    const targetLearningSkills = currentUser.skillsLearning || [];
    const myTeachingSkills = currentUser.skillsTeaching || [];

    const otherSkills = await Skill.find({ user: { $ne: userId } })
      .populate('user', 'name avatar university major skillsTeaching skillsLearning')
      .limit(20);

    const recommendedMatches = otherSkills
      .map(skill => {
        let matchScore = 0;
        const reasons = [];

        // Check if skill title or category matches what I want to learn
        const matchesMyLearning = targetLearningSkills.some(learnSkill =>
          skill.title.toLowerCase().includes(learnSkill.toLowerCase()) ||
          skill.category.toLowerCase().includes(learnSkill.toLowerCase()) ||
          skill.description.toLowerCase().includes(learnSkill.toLowerCase())
        );

        if (matchesMyLearning) {
          matchScore += 2;
          reasons.push('Teaches a skill you want to learn');
        }

        // Check if this teacher wants something I can teach (reciprocal swap!)
        const wantsWhatITeach = (skill.wantedSkills || []).some(wanted =>
          myTeachingSkills.some(teach =>
            teach.toLowerCase().includes(wanted.toLowerCase()) ||
            wanted.toLowerCase().includes(teach.toLowerCase())
          )
        );

        if (wantsWhatITeach) {
          matchScore += 3;
          reasons.push('Looking for skills you can teach (Direct Match!)');
        }

        return {
          skill,
          matchScore,
          reasons,
        };
      })
      .filter(item => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    res.json({
      success: true,
      stats: {
        mySkillsCount: mySkills.length,
        receivedPendingCount: receivedRequests.filter(r => r.status === 'pending').length,
        activeExchangesCount: activeExchanges.length,
        totalCompletedCount: [...receivedRequests, ...sentRequests].filter(r => r.status === 'completed').length,
      },
      recentReceived: receivedRequests.slice(0, 5),
      recentSent: sentRequests.slice(0, 5),
      mySkills,
      recommendedMatches,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
