/** 
 * Byimaan 
 * */

import {RedisOptions, Redis} from "ioredis"

const MAX_RETRIES_TO_ESTABLISH_CONNECTION = 3;

export type CreateRedisInstanceOrThrow = {
    config: RedisOptions,
    consumerName: string
}

export function createRedisInstanceOrThrow({config, consumerName}: CreateRedisInstanceOrThrow) {
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
                    throw new Error(`Redis-${consumerName} connection error. Could not connect after ${times}`);
                };
                return Math.min(times*200, 1000)
            },
        };

        const redis = new Redis(redisOptions);
        redis.on('error', (error:unknown) => {
            console.warn(`[Redis-${consumerName}] Error connecting `, error);
        });

        return redis

    } catch (error) {
        throw new Error(`[Redis-${consumerName}] Could not connect a Redis instance`);
    };
};