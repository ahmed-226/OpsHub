const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect().catch(err => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);
});

module.exports = client;