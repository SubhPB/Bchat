/**
 * Byimaan
 */
import { createRedisInstanceOrThrow } from '@repo/io-redis/redis-client';

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

type Props = {
    consumerName: string
}

const getRedisClientOrThrow = ({consumerName}:Props) => {
    return createRedisInstanceOrThrow({
        config: configuration,
        consumerName
    })
};
export {getRedisClientOrThrow}