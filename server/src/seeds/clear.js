import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import ExchangeRequest from '../models/ExchangeRequest.js';

dotenv.config();

const clearDatabase = async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/skillswap_campus';

  try {
    console.log('Connecting to MongoDB at:', uri);
    await mongoose.connect(uri);
    console.log('Connected! Removing all users, skills, and exchange requests...');

    const deletedUsers = await User.deleteMany({});
    const deletedSkills = await Skill.deleteMany({});
    const deletedRequests = await ExchangeRequest.deleteMany({});

    console.log(`\n====================================================`);
    console.log(`✨ SkillSwap Campus Database Cleared Successfully!`);
    console.log(`   - Users removed: ${deletedUsers.deletedCount}`);
    console.log(`   - Skills removed: ${deletedSkills.deletedCount}`);
    console.log(`   - Requests removed: ${deletedRequests.deletedCount}`);
    console.log(`====================================================\n`);

    process.exit(0);
  } catch (error) {
    console.error('Clear database script error:', error);
    process.exit(1);
  }
};

clearDatabase();
