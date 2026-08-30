import express from 'express';
import Budget from '../models/Budget.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All budget routes require authentication
router.use(requireAuth);

// GET all budgets for current user
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST create a new budget
router.post('/', async (req, res) => {
  try {
    const newBudget = new Budget({
      ...req.body,
      user: req.user.id
    });
    
    // Convert empty string tripId to null to avoid ObjectId casting errors
    if (!newBudget.tripId) {
      newBudget.tripId = undefined;
    }
    
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// PUT update an existing budget
router.put('/:id', async (req, res) => {
  try {
    const bodyToUpdate = { ...req.body };
    if (!bodyToUpdate.tripId) {
      bodyToUpdate.tripId = undefined; // unset invalid ObjectId
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: bodyToUpdate },
      { new: true, runValidators: true }
    );
    
    if (!updatedBudget) return res.status(404).json({ message: 'Budget not found' });
    res.json(updatedBudget);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// DELETE a budget
router.delete('/:id', async (req, res) => {
  try {
    const deletedBudget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedBudget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
