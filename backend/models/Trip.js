import mongoose from 'mongoose';

const dayPlanSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, default: '' },
    activities: { type: [String], default: [] }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    destination: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String, default: '' },
    budget: { type: Number, default: 0 },
    activities: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'upcoming'
    },
    // Populated when this trip was created from the AI itinerary generator
    aiGenerated: { type: Boolean, default: false },
    aiItinerary: { type: [dayPlanSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
