import { client, connectRedis } from '../server/config/redis.js';

async function check() {
    await connectRedis();
    const keys = await client.keys('user:*');
    console.log('User keys:', keys);
    if (keys.length > 0) {
        const data = await client.hGetAll(keys[0]);
        console.log('Sample user data:', data);
    }
    process.exit();
}

check();
