import Redis from 'ioredis';
var redis = new Redis();
var redisPubSub = new Redis();

export {redis, redisPubSub};
