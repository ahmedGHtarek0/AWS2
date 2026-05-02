import { createClient } from 'redis';


const client = createClient({
    username: 'default',
    password:'Dd3Zy1hSKMAImla4IxnoBh3sjBAqSnDA',
    socket: {
        host: 'redis-13838.c16.us-east-1-3.ec2.cloud.redislabs.com',
        port: 13838
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
