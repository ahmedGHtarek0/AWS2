import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    }
});

client.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
        console.log('Connected to Redis');
    }
};

export { client, connectRedis };
