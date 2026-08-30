import express from 'express';
import PackingList from '../models/PackingList.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All packing list routes require authentication
router.use(requireAuth);

// GET all packing lists for current user
router.get('/', async (req, res) => {
  try {
    const packingLists = await PackingList.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(packingLists);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST create a new packing list
router.post('/', async (req, res) => {
  try {
    const newPackingList = new PackingList({
      ...req.body,
      user: req.user.id
    });
    
    // Convert empty string tripId to null to avoid ObjectId casting errors
    if (!newPackingList.tripId) {
      newPackingList.tripId = undefined;
    }
    
    const savedPackingList = await newPackingList.save();
    res.status(201).json(savedPackingList);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// PUT update an existing packing list
router.put('/:id', async (req, res) => {
  try {
    const bodyToUpdate = { ...req.body };
    if (!bodyToUpdate.tripId) {
      bodyToUpdate.tripId = undefined; // unset invalid ObjectId
    }

    const updatedPackingList = await PackingList.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: bodyToUpdate },
      { new: true, runValidators: true }
    );
    
    if (!updatedPackingList) return res.status(404).json({ message: 'Packing List not found' });
    res.json(updatedPackingList);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// DELETE a packing list
router.delete('/:id', async (req, res) => {
  try {
    const deletedPackingList = await PackingList.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedPackingList) return res.status(404).json({ message: 'Packing List not found' });
    res.json({ message: 'Packing List deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
