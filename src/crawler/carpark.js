import * as carpark   from '../service/occupancy/carpark';
import config         from '../config';
import {redis}        from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_CARPARK', true);
const CRAWL_TTL   = config('CRAWL_TTL_CARPARK', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_occupancy_carpark';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_occupancy_carpark';

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
            console.log('CARPARK CRAWLER ERROR', err.message);
        }
    });
};

const loadCache = async () => {
    if (cache) {
        return false;
    }

    try {
        cache = await carpark.load();

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
        console.log('CARPARK CRAWLER LOAD CACHE ERROR', err.message);
    }

    return true;
};

const crawl = async () => {
    if (await loadCache()) {
        return nextCrawl();
    }

    try {
        newData = await carpark.load();
    } catch (err) {
        return nextCrawl();
    }

    // update
    var updatedCarparks = cache.features.filter(row => {
        var oldRow = newData.features.find(row2 => row2.properties.id === row.properties.id);
        return oldRow && (JSON.stringify(row) !=  JSON.stringify(oldRow));
    });

    // update
    if (updatedCarparks.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: updatedCarparks.map(carpark.compileStream)
            })
        );
    }

    // new
    var newCarparks = newData.features.filter(row => {
        return !cache.features.find(row2 => row2.properties.id === row.properties.id);
    });

    if (newCarparks.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'new',
                data: newCarparks.map(carpark.compileStream)
            })
        );
    }

    // deleted
    var deletedCarparks = cache.features.filter(row => {
        return !newData.features.find(row2 => row2.properties.id === row.properties.id);
    });
    if (deletedCarparks.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'delete',
                data: deletedCarparks.map(carpark.compileStream)
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

    for (let i=0; i<cache.features.length;i++) {
        let id = cache.features[i].properties.id;

        await redis.set(
            CACHE_TABLE + '_' + id,
            JSON.stringify(cache.features[i]),
            'EX',
            CACHE_TTL
        );
    }

    nextCrawl();
};

// Run crawler
nextCrawl();
