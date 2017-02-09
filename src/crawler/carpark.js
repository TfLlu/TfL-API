import * as carpark   from '../service/occupancy/carpark';
import config         from '../config';
import {redis}        from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_CARPARK', true);
const CRAWL_TTL   = config('CRAWL_TTL_CARPARK', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_occupancy_carpark';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_occupancy_carpark';

const crawl = async () => {
    var startTime = new Date().getTime();
    if (!cache) {
        try {
            cache = await carpark.load();
        } catch (err) {
            setTimeout(crawl, CRAWL_TTL);
            return;
        }
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
    newData = await carpark.load();

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

    var diffTime = new Date().getTime() - startTime;
    var timeOut = CRAWL_TTL - diffTime < 0 ? 0 : CRAWL_TTL - diffTime;
    setTimeout(crawl, timeOut);
};

// Run crawler
crawl();
