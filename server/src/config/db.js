import mongoose from 'mongoose';

const connectDB = async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/skillswap_campus';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(` MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(` Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`\n⚠️  MongoDB Connection Error: ${error.message}`);
    console.error('----------------------------------------------------');
    console.error('To run SkillSwap Campus with MongoDB:');
    console.error('1. Make sure MongoDB Community Server is installed & running.');
    console.error('   OR start it using: net start MongoDB (or mongod)');
    console.error('2. You can view & inspect data anytime in MongoDB Compass at:');
    console.error(`   ${uri}`);
    console.error('3. If using MongoDB Atlas, replace MONGODB_URI in .env with your Atlas URI.');
    console.error('----------------------------------------------------\n');
  }
};

export default connectDB;
