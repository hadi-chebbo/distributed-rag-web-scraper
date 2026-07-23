import { redis } from "../redis/connection.js";

const URL_CACHE_PREFIX = "visited:url";

export async function isUrlCached(url: string) {
    const key = `${URL_CACHE_PREFIX}${url}`;

    const exists = await redis.exists(key);

    return exists === 1;
}

export async function cacheUrl(url: string) {
    const key = `${URL_CACHE_PREFIX}${url}`;

    await redis.set(key, "1", "EX", 60*60);
}