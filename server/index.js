import express from 'express';
import cors from 'cors';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.js';
import coreRoutes from './routes/core.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes);

// Connect to Redis and start server
const startServer = async () => {
    try {
        await connectRedis();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:5000`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
