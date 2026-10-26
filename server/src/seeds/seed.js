import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import ExchangeRequest from '../models/ExchangeRequest.js';
import { seedUsers, seedSkills } from './seedData.js';

dotenv.config();

const seedDatabase = async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/skillswap_campus';

  try {
    console.log('Connecting to MongoDB at:', uri);
    await mongoose.connect(uri);
    console.log(' Connected! Clearing existing collections...');

    await User.deleteMany({});
    await Skill.deleteMany({});
    await ExchangeRequest.deleteMany({});
    console.log(' Cleared old collections.');

    console.log(' Creating student users...');
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(` Created ${createdUsers.length} student profiles.`);

    // Map email to user ObjectId
    const userMap = {};
    createdUsers.forEach(u => {
      userMap[u.email] = u._id;
    });

    console.log(' Creating skill listings...');
    const createdSkills = [];
    for (const skillData of seedSkills) {
      const userId = userMap[skillData.userEmail];
      if (userId) {
        const skill = await Skill.create({
          title: skillData.title,
          category: skillData.category,
          level: skillData.level,
          description: skillData.description,
          syllabus: skillData.syllabus,
          wantedSkills: skillData.wantedSkills,
          mode: skillData.mode,
          availability: skillData.availability,
          user: userId,
        });
        createdSkills.push(skill);
      }
    }
    console.log(` Created ${createdSkills.length} skill listings.`);

    // Find specific skills to create realistic sample exchange requests
    const pythonSkill = createdSkills.find(s => s.title.includes('Python'));
    const designSkill = createdSkills.find(s => s.title.includes('Graphic Design'));
    const reactSkill = createdSkills.find(s => s.title.includes('React'));
    const videoSkill = createdSkills.find(s => s.title.includes('Video Editing'));
    const speechSkill = createdSkills.find(s => s.title.includes('Public Speaking'));
    const mlSkill = createdSkills.find(s => s.title.includes('Machine Learning'));

    const alexId = userMap['alex.chen@campus.edu'];
    const mayaId = userMap['maya.rodriguez@campus.edu'];
    const davidId = userMap['david.kim@campus.edu'];
    const sophiaId = userMap['sophia.patel@campus.edu'];
    const marcusId = userMap['marcus.johnson@campus.edu'];
    const aishaId = userMap['aisha.khan@campus.edu'];

    console.log(' Creating sample skill exchange requests...');
    const sampleRequests = [
      {
        sender: alexId,
        receiver: mayaId,
        skillRequested: designSkill._id,
        skillOffered: 'Python for Beginners & Web Scraping',
        message: 'Hi Maya! I loved your portfolio. I can teach you Python basics and script automation in exchange for Figma UI design lessons!',
        preferredMode: 'Flexible / Chat First',
        status: 'pending',
      },
      {
        sender: mayaId,
        receiver: alexId,
        skillRequested: pythonSkill._id,
        skillOffered: 'Figma UI/UX & Design Systems',
        message: 'Hey Alex, exactly what I was looking for! I would be thrilled to exchange design sessions for Python scripting.',
        preferredMode: 'Online (Zoom/Google Meet)',
        status: 'accepted',
        responseNote: 'Accepted! Let’s connect on Discord (maya_design#8821) to set our first schedule.',
        exchangeLocation: 'Discord Voice & Screen Share Room 1',
      },
      {
        sender: davidId,
        receiver: sophiaId,
        skillRequested: videoSkill._id,
        skillOffered: 'Modern React.js & Web Development',
        message: 'Hey Sophia, I am launching a tutorial series for our campus tech club and need Premiere Pro help. Happy to teach you React in return!',
        preferredMode: 'In-Person (Campus Library / Student Center)',
        status: 'accepted',
        responseNote: 'Sounds awesome David! Let’s meet at the 2nd floor library study pod.',
        exchangeLocation: 'Main Campus Library - 2nd Floor Study Pod C',
      },
      {
        sender: marcusId,
        receiver: aishaId,
        skillRequested: mlSkill._id,
        skillOffered: 'Public Speaking & Confident Pitching',
        message: 'Hi Aisha, I would love to learn the intuition behind neural networks for my business analytics capstone. Can offer pitch coaching in return!',
        preferredMode: 'Online (Zoom/Google Meet)',
        status: 'pending',
      },
    ];

    await ExchangeRequest.insertMany(sampleRequests);
    console.log(` Created ${sampleRequests.length} realistic exchange requests.`);

    console.log('\n=============================================');
    console.log('🎉 Seed process finished successfully!');
    console.log('Test credentials:');
    console.log('  Alex Chen:        alex.chen@campus.edu      / password123 (Python Tutor)');
    console.log('  Maya Rodriguez:   maya.rodriguez@campus.edu / password123 (Graphic Designer)');
    console.log('  David Kim:        david.kim@campus.edu      / password123 (React Developer)');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed script error:', error);
    process.exit(1);
  }
};

seedDatabase();
