import mongoose from 'mongoose';

export const FEEDBACK_CATEGORIES = [
  'Bug Report',
  'Feature Request',
  'Skill Suggestion',
  'General Feedback',
];

export const FEEDBACK_STATUSES = ['new', 'reviewed', 'resolved'];

const feedbackSchema = new mongoose.Schema(
  {
    // Set when a signed-in student sends the feedback; null for guests
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 120,
      default: '',
    },
    category: {
      type: String,
      enum: FEEDBACK_CATEGORIES,
      default: 'General Feedback',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: FEEDBACK_STATUSES,
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ user: 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
