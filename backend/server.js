import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import itemRoutes from './routes/itemRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB before server starts
connectDB();

app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => res.send('ReCircle API running!'));

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
