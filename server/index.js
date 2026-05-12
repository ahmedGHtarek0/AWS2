import express from 'express';
import cors from 'cors';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.js';
import coreRoutes from './routes/core.js';

const app = express();
const PORT = 5000;


// write a code for ratetime lime from DDOS attack using express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.get("/", (req, res) => {
  res.send("ROOT endpoint test successfully");
});

app.get("/health", (req, res) => {
  res.send("connected Ec2 to backend Successfully");
});

app.use('/api', coreRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ 
        message: 'Internal Server Error', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// Connect to Redis and start server
const startServer = async () => {
    try {
        await connectRedis();
        app.listen(5000, "0.0.0.0", () => {
            console.log("Server running on http://0.0.0.0:5000");
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
