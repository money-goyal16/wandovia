import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // Using string since frontend uses Date.now() + Math.random() or similar
    name: { type: String, required: true },
    packed: { type: Boolean, default: false },
    category: { type: String, default: 'general' }
  },
  { _id: false }
);

const packingListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    name: { type: String, required: true, trim: true },
    tripType: { type: String, default: 'general' },
    items: { type: [itemSchema], default: [] }
  },
  { timestamps: true }
);

// Ensure that we transform _id to id when returning JSON
packingListSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('PackingList', packingListSchema);
