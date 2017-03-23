import * as departures from '../service/stoppoint/departures';
import config          from '../config';
import {redis}         from '../redis';

const CACHE_TTL              = config('CACHE_TTL_STOPPOINT_DEPARTURE', true);
const CRAWL_TTL              = config('CRAWL_TTL_STOPPOINT_DEPARTURE', true);
const CRAWL_AMOUNT           = config('CRAWL_STOPPOINT_DEPARTURE_AMOUNT', true);
const PUB_TABLE              = config('NAME_VERSION', true) + '_stoppoint_departures_';
const CACHE_TABLE            = config('NAME_VERSION', true) + '_cache_stoppoint_departures';
const CACHE_STOPPOINTS_TABLE = config('NAME_VERSION', true) + '_cache_stoppoint';
const MAX_CONCURRENT_CRAWLS  = config('CRAWL_MAX_CONCURRENT_STOPPOINT_DEPARTURE', true);
const CACHE_AGENCIES         = config('NAME_VERSION', true) + '_cache_agencies';

var cache = {};
var JobsToAdd;
var agencies;
var stopPointsToCrawl = [];
var currentlyCrawling = [];

const worker = async retry => {
    retry = retry || 10;
    var stopPointID = stopPointsToCrawl.shift();
    currentlyCrawling.push(stopPointID);

    while(retry) {
        retry--;
        try {
            var newData = await departures.load(stopPointID, CRAWL_AMOUNT, agencies);
            break;
        } catch (err) {
            if (!err.code) {
                if (err.response) {
                    if (err.response.status) {
                        err.code = err.response.status;
                    }
                }
            }
            if (err.code === 400) {
                removeFromCrawlList(stopPointID);
                return;
            }
            if (retry === 0) {
                removeFromCrawlList(stopPointID);
                console.log('error', err.code, err.message);
                return;
            }
        }
    }

    removeFromCrawlList(stopPointID);

    if (!cache[stopPointID]) {
        cache[stopPointID] = newData;
        await redis.set(
            CACHE_TABLE + '_' + stopPointID,
            JSON.stringify(newData),
            'EX',
            CACHE_TTL
        );
        return;
    }

    // update
    var updatedDepartures = cache[stopPointID].filter(row => {
        var oldRow = newData.find(row2 => row2.id === row.id);
        return oldRow && (JSON.stringify(row) !=  JSON.stringify(oldRow));
    });
    if (updatedDepartures.length) {
        await redis.publish(
            PUB_TABLE + stopPointID,
            JSON.stringify({
                type: 'update',
                data: {
                    [stopPointID]: updatedDepartures
                }
            })
        );
    }

    // deleted
    var deletedDepartures = cache[stopPointID].filter(row => {
        return !newData.find(row2 => row2.id === row.id);
    });
    if (deletedDepartures.length) {
        await redis.publish(
            PUB_TABLE + stopPointID,
            JSON.stringify({
                type: 'delete',
                data: {
                    [stopPointID]: deletedDepartures
                }
            })
        );
    }

    // new
    var newDepartures = newData.filter(row => {
        return !cache[stopPointID].find(row2 => row2.id === row.id);
    });
    if (newDepartures.length) {
        await redis.publish(
            PUB_TABLE + stopPointID,
            JSON.stringify({
                type: 'new',
                data: {
                    [stopPointID]: newDepartures
                }
            })
        );
    }

    cache[stopPointID] = newData;
    await redis.set(
        CACHE_TABLE + '_' + stopPointID,
        JSON.stringify(newData),
        'EX',
        CACHE_TTL
    );
};

const removeFromCrawlList = id => {
    var index = currentlyCrawling.indexOf(id);
    if (index > -1) {
        currentlyCrawling.splice(index, 1);
    }
};

const crawl = async () => {
    var result = await redis.get(CACHE_STOPPOINTS_TABLE);
    agencies = JSON.parse(await redis.get(CACHE_AGENCIES));
    if (result && result !== '') {
        stopPointsToCrawl = (JSON.parse(result)).features;
    } else {
        setTimeout(crawl, CRAWL_TTL);
        return;
    }

    stopPointsToCrawl = stopPointsToCrawl.map(item => {
        return item.properties.id;
    });

    while (stopPointsToCrawl.length !== 0) {
        JobsToAdd = Math.min(MAX_CONCURRENT_CRAWLS, stopPointsToCrawl.length) - currentlyCrawling.length;

        if (JobsToAdd <= 0) {
            await sleep();
            continue;
        }
        for (var i = 1; i <= JobsToAdd; i++) {
            worker();
        }
        await sleep();
    }
    if (process.env.TRAVIS) {
        process.exit();
    }

    await redis.set(
        CACHE_TABLE,
        JSON.stringify(cache),
        'EX',
        CACHE_TTL
    );

    setTimeout(crawl);
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Run crawler
crawl();
