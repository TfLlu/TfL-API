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

const crawl = async () => {
    var startTime = new Date().getTime();
    if (!cache) {
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
        setTimeout(crawl, CRAWL_TTL);
        return;
    }
    newData = await bikepoint.load();

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
                data: updatedBikePoints.map(compileStream)
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
                data: newBikePoints.map(compileStream)
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
                data: deletedBikePoints.map(compileStream)
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

const compileStream = bikePoint => {
    return {
        id: bikePoint.properties.id,
        data: bikePoint,
    };
};

// Run crawler
crawl();
