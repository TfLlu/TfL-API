import * as airport from '../service/airport';
import config       from '../config';
import {redis}      from '../redis';

var newData = [];
var cache;
var keys = ['arrivals', 'departures'];

const CACHE_TTL   = config('CACHE_TTL_AIRPORT', true);
const CRAWL_TTL   = config('CRAWL_TTL_AIRPORT', true);
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_airport_';

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
            console.log('AIRPORT CRAWLER ERROR', err.message);
        }
    });
};

const loadCache = async () => {
    if (cache) {
        return false;
    }

    try {
        cache = await airport.load();

        for (let i=0;i<keys.length; i++) {
            await redis.set(
                CACHE_TABLE + keys[i],
                JSON.stringify(cache[keys[i]]),
                'EX',
                CACHE_TTL
            );
        }

        if (process.env.TRAVIS) {
            process.exit();
        }
    } catch (err) {
        console.log('AIRPORT CRAWLER LOAD CACHE ERROR', err.message);
    }

    return true;
};

const crawl = async () => {
    if (await loadCache()) {
        return nextCrawl();
    }

    try {
        newData = await airport.load();
    } catch (err) {
        return nextCrawl();
    }

    cache = newData;
    for (let i=0;i<keys.length; i++) {
        await redis.set(
            CACHE_TABLE + keys[i],
            JSON.stringify(cache[keys[i]]),
            'EX',
            CACHE_TTL
        );
    }
    nextCrawl();
};

// Run crawler
nextCrawl();
