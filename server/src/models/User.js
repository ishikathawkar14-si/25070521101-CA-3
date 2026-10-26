import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    university: {
      type: String,
      default: 'Campus University',
      trim: true,
    },
    major: {
      type: String,
      default: 'Computer Science',
      trim: true,
    },
    year: {
      type: String,
      default: 'Sophomore',
      enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Alumni'],
    },
    bio: {
      type: String,
      default: 'Excited to share skills, learn new things, and collaborate with fellow students!',
      maxlength: 500,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    skillsTeaching: {
      type: [String],
      default: [],
    },
    skillsLearning: {
      type: [String],
      default: [],
    },
    skillsOffered: {
      type: [String],
      default: [],
    },
    skillsWanted: {
      type: [String],
      default: [],
    },
    contactInfo: {
      discord: { type: String, default: '' },
      telegram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      preferred: {
        type: String,
        enum: ['College Email', 'Discord', 'In-Person Library', 'Telegram'],
        default: 'College Email',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude password from JSON responses and sync offered/wanted aliases
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  user.skillsOffered = (user.skillsOffered && user.skillsOffered.length > 0) ? user.skillsOffered : (user.skillsTeaching || []);
  user.skillsWanted = (user.skillsWanted && user.skillsWanted.length > 0) ? user.skillsWanted : (user.skillsLearning || []);
  user.skillsTeaching = user.skillsOffered;
  user.skillsLearning = user.skillsWanted;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;
