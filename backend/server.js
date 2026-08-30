import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import tripRoutes from './routes/trips.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import budgetRoutes from './routes/budgets.js';
import packingListRoutes from './routes/packingLists.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/trips', tripRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/packing-lists', packingListRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`TrailMuse backend running on port ${PORT}`));
});
