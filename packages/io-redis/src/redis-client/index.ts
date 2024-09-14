/** 
 * Byimaan 
 * */

import {RedisOptions, Redis} from "ioredis"

const REDIS_HOST=process.env.REDIS_HOST,
REDIS_PASSWORD=process.env.REDIS_PASSWORD,
REDIS_USERNAME=process.env.REDIS_USERNAME,
REDIS_PORT=process.env.REDIS_PORT || 6379;

const configuration = {
   port: Number(REDIS_PORT),
   host: REDIS_HOST,
   username: REDIS_USERNAME,
   password: REDIS_PASSWORD
};

const MAX_RETRIES_TO_ESTABLISH_CONNECTION = 3;

export default function createRedisInstanceOrThrow(config = configuration) {
    try {

        const redisOptions : RedisOptions = {
            host: config.host,
            password: config.password,
            port: config.port,
            lazyConnect: true,
            showFriendlyErrorStack: true,
            enableAutoPipelining: true,
            maxRetriesPerRequest: 0,
            retryStrategy: (times: number) => {
                if (times > MAX_RETRIES_TO_ESTABLISH_CONNECTION){
                    throw new Error(`Redis connection error. Could not connect after ${times}`);
                };
                return Math.min(times*200, 1000)
            },
        };

        const redis = new Redis(redisOptions);
        redis.on('error', (error:unknown) => {
            console.warn('[Redis] Error connecting ', error);
        });

        return redis

    } catch (error) {
        throw new Error("[Redis] Could not connect a Redis instance");
    };
};