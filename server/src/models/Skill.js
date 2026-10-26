import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Skill title is required'],
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: [
        'Programming',
        'Design & Creative',
        'Data & AI',
        'Academics & Science',
        'Languages',
        'Business & Marketing',
        'Media & Audio/Video',
        'Other',
      ],
      default: 'Programming',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    type: {
      type: String,
      enum: ['offered', 'wanted'],
      default: 'offered',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 1500,
    },
    syllabus: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wantedSkills: {
      type: [String],
      default: [],
    },
    mode: {
      type: String,
      enum: ['In-Person (Campus)', 'Online / Zoom / Discord', 'Flexible / Hybrid'],
      default: 'Flexible / Hybrid',
    },
    availability: {
      type: String,
      default: 'Weekdays 5 PM - 8 PM or Weekends',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual owner alias for user
skillSchema.virtual('owner').get(function () {
  return this.user;
});

// Virtual index for quick search
skillSchema.index({ title: 'text', description: 'text', category: 'text' });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
