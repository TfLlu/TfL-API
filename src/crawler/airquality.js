import * as airquality from '../service/weather/airquality';
import config          from '../config';
import {redis}         from '../redis';
import deepClone       from 'deep-clone';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_WEATHER_AIRQUALITY', true);
const CRAWL_TTL   = config('CRAWL_TTL_WEATHER_AIRQUALITY', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_weather_airquality';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_weather_airquality';

var nextCrawlTimeoutHandle = null;
var nextCrawlStartTime = null;
const nextCrawl = () => {
    if(nextCrawlTimeoutHandle) {
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
            console.log('AIRQUALITY CRAWLER ERROR', err.message);
        }
    });

};

const loadCache = async () => {
    if (cache) {
        return false;
    }

    try {
        cache = await airquality.load();

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
        console.log('AIRQUALITY CRAWLER LOAD CACHE ERROR', err.message);
    }

    return true;
};

const crawl = async () => {
    if (await loadCache()) {
        return nextCrawl();
    }

    try {
        newData = await airquality.load();
    } catch (err) {
        return nextCrawl();
    }

    // update
    var updatedWeatherStations = cache.features.filter(row => {
        var oldRow    = newData.features.find(row2 => row2.properties.id === row.properties.id);
        var tmpRow    = deepClone(row);
        delete tmpRow.properties.last_update;
        var tmpOldRow = deepClone(oldRow);
        delete tmpOldRow.properties.last_update;
        return oldRow && (JSON.stringify(tmpRow) !=  JSON.stringify(tmpOldRow));
    });

    if (updatedWeatherStations.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: updatedWeatherStations.map(airquality.compileStream)
            })
        );
    }

    // new
    var newWeatherStations = newData.features.filter(row => {
        return !cache.features.find(row2 => row2.properties.id === row.properties.id);
    });

    if (newWeatherStations.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'new',
                data: newWeatherStations.map(airquality.compileStream)
            })
        );
    }

    // deleted
    var deletedWeatherStations = cache.features.filter(row => {
        return !newData.features.find(row2 => row2.properties.id === row.properties.id);
    });
    if (deletedWeatherStations.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'delete',
                data: deletedWeatherStations.map(airquality.compileStream)
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
