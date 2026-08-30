import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    budgeted: { type: Number, default: 0 },
    spent: { type: Number, default: 0 }
  },
  { _id: false }
);

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    name: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, default: 0 },
    categories: {
      accommodation: { type: categorySchema, default: () => ({ budgeted: 0, spent: 0 }) },
      transportation: { type: categorySchema, default: () => ({ budgeted: 0, spent: 0 }) },
      food: { type: categorySchema, default: () => ({ budgeted: 0, spent: 0 }) },
      activities: { type: categorySchema, default: () => ({ budgeted: 0, spent: 0 }) },
      shopping: { type: categorySchema, default: () => ({ budgeted: 0, spent: 0 }) },
      miscellaneous: { type: categorySchema, default: () => ({ budgeted: 0, spent: 0 }) }
    }
  },
  { timestamps: true }
);

// Ensure that we transform _id to id when returning JSON
budgetSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Budget', budgetSchema);
