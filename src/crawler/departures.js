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

var cache = {};
var JobsToAdd;
var stopPointsToCrawl = [];
var currentlyCrawling = [];

const worker = async count => {
    var stopPointID = stopPointsToCrawl.shift();
    currentlyCrawling.push(stopPointID);

    while(count) {
        count--;
        try {

            try {

                var newData = await departures.get(stopPointID, CRAWL_AMOUNT);

                removeFromCrawlList(stopPointID);

                if (!cache[stopPointID]) {
                    cache[stopPointID] = newData;
                    redis.set(
                        CACHE_TABLE,
                        JSON.stringify(cache),
                        'EX',
                        CACHE_TTL
                    );
                    if (process.env.TRAVIS) {
                        process.exit();
                    }
                    return;
                }

                // update
                var updatedDepartures = cache[stopPointID].filter(row => {
                    var oldRow = newData.find(row2 => row2.id === row.id);
                    return oldRow && (JSON.stringify(row) !=  JSON.stringify(oldRow));
                });
                if (updatedDepartures.length) {
                    redis.publish(
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
                    redis.publish(
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
                    redis.publish(
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
                redis.set(
                    CACHE_TABLE,
                    JSON.stringify(cache),
                    'EX',
                    CACHE_TTL
                );

            } catch (err) {
                removeFromCrawlList(stopPointID);
                var code = 'UNKNOWN';
                if (err.code) {
                    code = err.code;
                } else {
                    if (err.response) {
                        if (err.response.status) {
                            code = err.response.status;
                        }
                    }
                }
                err.code = code;
                throw err;
            }

        } catch (err) {
            if (err.code === 400) {
                return;
            }
            if (count === 0) {
                console.log('error', err.code, err.message, currentlyCrawling.length);
                console.log(err.config.url);
            }
        }
    }
};

const removeFromCrawlList = id => {
    var index = currentlyCrawling.indexOf(id);
    if (index > -1) {
        currentlyCrawling.splice(index, 1);
    }
};

const crawl = async () => {
    //var startTime = new Date().getTime();
    var result = await redis.get(CACHE_STOPPOINTS_TABLE);
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
            worker(10);
        }
        await sleep();
    }

    //var diffTime = new Date().getTime() - startTime;
    //var timeOut = CRAWL_TTL - diffTime < 0 ? 0 : CRAWL_TTL - diffTime;
    //setTimeout(crawl, timeOut);
    //setTimeout(crawl);
    process.exit();
};

setInterval(function() {
    console.log('queue', stopPointsToCrawl.length);
}, 5000);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Run crawler
crawl();
