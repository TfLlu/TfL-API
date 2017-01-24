import * as stoppoint from '../service/stoppoint';
import config         from '../config';
import {redis}        from '../redis';

var newData = [];
var cache;

var stopPointsToCrawl = [];

const CACHE_TTL              = config('CACHE_TTL_STOPPOINT_DEPARTURE', true);
const CRAWL_TTL              = config('CRAWL_TTL_STOPPOINT_DEPARTURE', true);
const CRAWL_AMOUNT           = config('CRAWL_TTL_STOPPOINT_DEPARTURE_AMOUNT', true);
const PUB_TABLE              = config('NAME_VERSION', true) + '_stoppoint_departure_';
const CACHE_TABLE            = config('NAME_VERSION', true) + '_cache_stoppoint_departure_';
const CACHE_STOPPOINTS_TABLE = config('NAME_VERSION', true) + '_cache_stoppoint';
const MAX_CONCURRENT_CRAWLS  = config('CRAWL_MAX_CONCURRENT_STOPPOINT_DEPARTURE', true);

var currentlyCrawling = [];

const queueWorker = () => {
    console.log('Jobs to do', stopPointsToCrawl.length);
    if (stopPointsToCrawl.length == 0) {
        return;
    }
    var JobsToAdd = MAX_CONCURRENT_CRAWLS - currentlyCrawling.length;
    if (JobsToAdd <= 0) {
        setTimeout(queueWorker, 100);
        return;
    }

    for (var i = 1; i <= JobsToAdd; i++) {
        worker();
    }
    setTimeout(queueWorker, 100);
    return;
}

const worker = () => {
    try {
        var stopPointID = stopPointsToCrawl.shift();
        currentlyCrawling.push(stopPointID);
        stoppoint.departures(stopPointID, CRAWL_AMOUNT)
            .then(res => {
                removeFromCrawlList(stopPointID);
                //TODO: do something with the result in
                //TODO: res
            }, err => {
                removeFromCrawlList(stopPointID);
            });
    } catch (err) {
        removeFromCrawlList(stopPointID);
    }
};

const removeFromCrawlList = id => {
    var index = currentlyCrawling.indexOf(id);
    if (index > -1) {
        currentlyCrawling.splice(index, 1);
    }
};

const crawl = async () => {
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
    await queueWorker();

/*
    Promise.all(promises)
        .then(() => {
            console.log(new Date().getTime() - startTime);
            process.exit();
        });
/*

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
    var updatedDeparturesPoints = cache.features.filter(row => {
        var oldRow = newData.features.find(row2 => row2.properties.id === row.properties.id);
        return oldRow && (JSON.stringify(row) !=  JSON.stringify(oldRow));
    });

    // update
    if (updatedDeparturesPoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: updatedDeparturesPoints.map(stoppoint.compileStream)
            })
        );
    }

    // new
    var newDeparturesPoints = newData.features.filter(row => {
        return !cache.features.find(row2 => row2.properties.id === row.properties.id);
    });

    if (newDeparturesPoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'new',
                data: newDeparturesPoints.map(stoppoint.compileStream)
            })
        );
    }

    // deleted
    var deletedDeparturesPoints = cache.features.filter(row => {
        return !newData.features.find(row2 => row2.properties.id === row.properties.id);
    });
    if (deletedDeparturesPoints.length) {
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'delete',
                data: deletedDeparturesPoints.map(stoppoint.compileStream)
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
    setTimeout(crawl, timeOut);*/
};

// Run crawler
crawl();
