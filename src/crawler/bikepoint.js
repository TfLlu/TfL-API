import * as bikepoint from '../service/bikepoint';
import config         from '../config';
import deepClone      from 'deep-clone';
import {redis}        from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_BIKEPOINT', true);
const CRAWL_TTL   = config('CRAWL_TTL_BIKEPOINT', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_bikepoint';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_bikepoint';

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
            console.log('BIKEPOINT CRAWLER ERROR', err.message);
        }
    });
};

const loadCache = async () => {
    if (cache) {
        return false;
    }

    try {
        cache = await bikepoint.load();

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
        console.log('BIKEPOINT CRAWLER LOAD CACHE ERROR', err.message);
    }

    return true;
};

const crawl = async () => {
    if (await loadCache()) {
        return nextCrawl();
    }

    try {
        newData = await bikepoint.load();
    } catch (err) {
        return nextCrawl();
    }

    // update
    var updatedBikePoints = cache.features.filter(row => {
        var oldRow = newData.features.find(row2 => row2.properties.id === row.properties.id);
        var tmpRow    = deepClone(row);
        delete tmpRow.properties.last_update;
        var tmpOldRow = deepClone(oldRow);
        delete tmpOldRow.properties.last_update;

        return oldRow && (JSON.stringify(tmpRow) !=  JSON.stringify(tmpOldRow));
    });

    // update
    if (updatedBikePoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: updatedBikePoints.map(bikepoint.compileStream)
            })
        );
    }

    // new
    var newBikePoints = newData.features.filter(row => {
        return !cache.features.find(row2 => row2.properties.id === row.properties.id);
    });

    if (newBikePoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'new',
                data: newBikePoints.map(bikepoint.compileStream)
            })
        );
    }

    // deleted
    var deletedBikePoints = cache.features.filter(row => {
        return !newData.features.find(row2 => row2.properties.id === row.properties.id);
    });
    if (deletedBikePoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'delete',
                data: deletedBikePoints.map(bikepoint.compileStream)
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
