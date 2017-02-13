import * as weather   from '../service/weather';
import config         from '../config';
import deepClone      from 'deep-clone';
import {redis}        from '../redis';

var newData = [];
var cache;

const CACHE_TTL   = config('CACHE_TTL_WEATHER', true);
const CRAWL_TTL   = config('CRAWL_TTL_WEATHER', true);
const PUB_TABLE   = config('NAME_VERSION', true) + '_weather';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_weather';

const crawl = async () => {
    var startTime = new Date().getTime();
    if (!cache) {
        try {
            cache = await weather.load();
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
    newData = await weather.load();

    // update
    var tmpCache   = deepClone(cache);
    delete tmpCache.dt;
    var tmpNewData = deepClone(newData);
    delete tmpNewData.dt;
    if (JSON.stringify(tmpCache) !=  JSON.stringify(tmpNewData)) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: newData
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
