import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { client } from '../config/redis.js';

export const signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const userKey = `user:${username}`;
        const userExists = await client.exists(userKey);

        if (userExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await client.hSet(userKey, {
            username,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const userKey = `user:${username}`;
        const userData = await client.hGetAll(userKey);

        if (!userData || Object.keys(userData).length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = uuidv4();
        const sessionKey = `session:${token}`;

        await client.set(sessionKey, username, {
            EX: 86400 // 24 hours
        });

        res.json({ token, username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const username = await client.get(`session:${token}`);

        if (!username) {
            return res.status(401).json({ message: 'Session expired' });
        }

        res.json({ username });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
