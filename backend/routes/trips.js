import express from 'express';
import Trip from '../models/Trip.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All trip routes require a logged-in user
router.use(requireAuth);

// GET /api/trips - list this user's trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips', details: err.message });
  }
});

// POST /api/trips - create a trip for this user
router.post('/', async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, user: req.user.id });
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create trip', details: err.message });
  }
});

// PUT /api/trips/:id - update a trip owned by this user
router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update trip', details: err.message });
  }
});

// DELETE /api/trips/:id - delete a trip owned by this user
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trip', details: err.message });
  }
});

export default router;
