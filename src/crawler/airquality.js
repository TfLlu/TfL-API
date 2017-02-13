import * as airquality from '../service/weather/airquality';
import config          from '../config';
import {redis}         from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_WEATHER_AIRQUALITY', true);
const CRAWL_TTL   = config('CRAWL_TTL_WEATHER_AIRQUALITY', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_weather_airquality';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_weather_airquality';

const crawl = async () => {
    var startTime = new Date().getTime();
    if (!cache) {
        try {
            cache = await airquality.load();
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
    newData = await airquality.load();

    // update
    var updatedWeatherStations = cache.features.filter(row => {
        var oldRow = newData.features.find(row2 => row2.properties.id === row.properties.id);
        return oldRow && (JSON.stringify(row) !=  JSON.stringify(oldRow));
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

    var diffTime = new Date().getTime() - startTime;
    var timeOut = CRAWL_TTL - diffTime < 0 ? 0 : CRAWL_TTL - diffTime;
    setTimeout(crawl, timeOut);
};

// Run crawler
crawl();
