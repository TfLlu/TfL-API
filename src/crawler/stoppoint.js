import * as stoppoint from '../service/stoppoint';
import config         from '../config';
import {redis}        from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_STOPPOINT', true);
const CRAWL_TTL   = config('CRAWL_TTL_STOPPOINT', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_stoppoint';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_stoppoint';

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
            console.log('STOPPOINT CRAWLER ERROR', err.message);
        }
    });
};

const loadCache = async () => {
    if (cache) {
        return false;
    }

    try {
        cache = await stoppoint.load();

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
        console.log('STOPPOINT CRAWLER LOAD CACHE ERROR', err.message);
    }

    return true;
};

const crawl = async () => {
    if (await loadCache()) {
        return nextCrawl();
    }

    try {
        newData = await stoppoint.load();
    } catch (err) {
        return nextCrawl();
    }

    // update
    var updatedStopPoints = cache.features.filter(row => {
        var oldRow = newData.features.find(row2 => row2.properties.id === row.properties.id);
        return oldRow && (JSON.stringify(row) !=  JSON.stringify(oldRow));
    });

    // update
    if (updatedStopPoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: updatedStopPoints.map(stoppoint.compileStream)
            })
        );
    }

    // new
    var newStopPoints = newData.features.filter(row => {
        return !cache.features.find(row2 => row2.properties.id === row.properties.id);
    });

    if (newStopPoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'new',
                data: newStopPoints.map(stoppoint.compileStream)
            })
        );
    }

    // deleted
    var deletedStopPoints = cache.features.filter(row => {
        return !newData.features.find(row2 => row2.properties.id === row.properties.id);
    });
    if (deletedStopPoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'delete',
                data: deletedStopPoints.map(stoppoint.compileStream)
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
