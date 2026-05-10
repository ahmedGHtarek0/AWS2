import { client, connectRedis } from '../server/config/redis.js';

async function check() {
    await connectRedis();
    const data = await client.hGetAll('user:ahmedtarek');
    console.log('Data for ahmedtarek:', data);
    process.exit();
}

check();
