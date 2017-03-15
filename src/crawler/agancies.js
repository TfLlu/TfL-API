import * as agencies from '../service/agencies';
import config    from '../config';
import {redis}   from '../redis';

var newData = [];
var cache;

const CACHE_TTL        = config('CACHE_TTL_AGENCIES', true);
const CRAWL_TTL        = config('CRAWL_TTL_AGENCIES', true);
const CACHE_TABLE      = config('NAME_VERSION', true) + '_cache_agencies';

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
            console.log('AGENCIES CRAWLER ERROR', err.message);
        }
    });
};

const loadCache = async () => {
    if (cache) {
        return false;
    }

    try {
        cache = await agencies.load();

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
        console.log('AGENCIES CRAWLER LOAD CACHE ERROR', err.message);
    }

    return true;
};

const crawl = async () => {
    if (await loadCache()) {
        return nextCrawl();
    }

    try {
        newData = await agencies.load();
    } catch (err) {
        return nextCrawl();
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
