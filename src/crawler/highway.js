import * as highway from '../service/highway';
import config       from '../config';
import {redis}      from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_HIGHWAY', true);
const CRAWL_TTL   = config('CRAWL_TTL_HIGHWAY', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_highway';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_highway';

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
            console.log('HIGHWAY CRAWLER ERROR', err.message);
        }
    });
};

const loadCache = async () => {
    if (cache) {
        return false;
    }

    try {
        cache = await highway.load();

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
        console.log('HIGHWAY CRAWLER LOAD CACHE ERROR', err.message);
    }

    return true;
};

const crawl = async () => {
    if (await loadCache()) {
        return nextCrawl();
    }

    try {
        newData = await highway.load();
    } catch (err) {
        return nextCrawl();
    }

    // update
    var updatedWeatherStations = cache.filter(row => {
        var oldRow    = newData.find(row2 => row2.id === row.id);
        return oldRow && (JSON.stringify(row) !=  JSON.stringify(oldRow));
    });

    if (updatedWeatherStations.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: updatedWeatherStations.map(highway.compileStream)
            })
        );
    }

    // new
    var newWeatherStations = newData.filter(row => {
        return !cache.find(row2 => row2.id === row.id);
    });

    if (newWeatherStations.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'new',
                data: newWeatherStations.map(highway.compileStream)
            })
        );
    }

    // deleted
    var deletedWeatherStations = cache.filter(row => {
        return !newData.find(row2 => row2.id === row.id);
    });
    if (deletedWeatherStations.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'delete',
                data: deletedWeatherStations.map(highway.compileStream)
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
