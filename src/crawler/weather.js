import * as weather   from '../service/weather';
import config         from '../config';
import deepClone      from 'deep-clone';
import {redis}        from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_WEATHER', true);
const CRAWL_TTL   = config('CRAWL_TTL_WEATHER', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_weather';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_weather';

var nextCrawlTimeoutHandle = null;
var nextCrawlStartTime = null;
const nextCrawl = () => {
    if (nextCrawlTimeoutHandle) {
        clearTimeout(nextCrawlTimeoutHandle);
    }

    var timeOut = 0;
    if (nextCrawlStartTime) {
        var diffTime = Date.now() - nextCrawlStartTime;
        timeOut = CRAWL_TTL - diffTime < 0 ? 0 : CRAWL_TTL - diffTime;
    }

    var timeoutPromise = new Promise(resolve => {
        nextCrawlTimeoutHandle = setTimeout(() => {
            resolve();
        }, timeOut);
    });
    return timeoutPromise.then(() => {
        nextCrawlStartTime = Date.now();
        try {
            return crawl();
        } catch (err) {
            console.log('WEATHER CRAWLER ERROR', err.message);
        }
    });
};

const loadCache = async () => {
    if (cache) {
        return false;
    }

    try {
        cache = await weather.load();

        await redis.set(
            CACHE_TABLE,
            JSON.stringify(cache),
            'EX',
            CACHE_TTL
        );
        if (process.env.TRAVIS) {
            process.exit();
        }
    } catch (err) {
        console.log('WEATHER CRAWLER LOAD CACHE ERROR', err.message);
    }

    return true;
};

const crawl = async () => {
    if (await loadCache()) {
        return nextCrawl();
    }

    try {
        newData = await weather.load();
    } catch (err) {
        return nextCrawl();
    }

    // update
    var tmpCache   = deepClone(cache);
    delete tmpCache.dt;
    var tmpNewData = deepClone(newData);
    delete tmpNewData.dt;
    if (JSON.stringify(tmpCache) !=  JSON.stringify(tmpNewData)) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: newData
            })
        );
    }

    cache = newData;

    await redis.set(
        CACHE_TABLE,
        JSON.stringify(cache),
        'EX',
        CACHE_TTL
    );

    nextCrawl();
};

// Run crawler
nextCrawl();
