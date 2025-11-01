const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', err => console.log('Redis Client Error', err));

// Connect immediately
client.connect().catch(err => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);
});

module.exports = client;
