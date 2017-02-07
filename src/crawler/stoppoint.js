import * as stoppoint from '../service/stoppoint';
import config         from '../config';
import {redis}        from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_STOPPOINT', true);
const CRAWL_TTL   = config('CRAWL_TTL_STOPPOINT', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_stoppoint';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_stoppoint';

const crawl = async () => {
    var startTime = new Date().getTime();
    if (!cache) {
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
        setTimeout(crawl, CRAWL_TTL);
        return;
    }
    newData = await stoppoint.load();

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

    var diffTime = new Date().getTime() - startTime;
    var timeOut = CRAWL_TTL - diffTime < 0 ? 0 : CRAWL_TTL - diffTime;
    setTimeout(crawl, timeOut);
};

// Run crawler
crawl();
