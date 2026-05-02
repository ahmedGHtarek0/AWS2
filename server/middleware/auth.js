import { client } from '../config/redis.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const username = await client.get(`session:${token}`);

        if (!username) {
            return res.status(401).json({ message: 'Session expired' });
        }

        req.username = username;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
