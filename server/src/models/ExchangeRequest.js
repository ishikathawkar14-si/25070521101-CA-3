import mongoose from 'mongoose';

const exchangeRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillRequested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    skillOffered: {
      type: String,
      required: [true, 'Skill offered in return is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please include a brief message explaining your exchange goal'],
      maxlength: 1000,
    },
    preferredMode: {
      type: String,
      enum: ['Online (Zoom/Google Meet)', 'In-Person (Campus Library / Student Center)', 'Flexible / Chat First'],
      default: 'Flexible / Chat First',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    responseNote: {
      type: String,
      default: '',
    },
    exchangeLocation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

exchangeRequestSchema.virtual('skill').get(function () {
  return this.skillRequested;
});

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);
export default ExchangeRequest;
