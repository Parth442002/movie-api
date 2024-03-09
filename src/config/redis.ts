import Redis from 'ioredis';

const redis=new Redis({
  host: 'redis', // Use the service name defined in Docker Compose
  port: 6379,    // Redis default port
});

export default redis