import * as bikepoint from '../service/bikepoint';
import config         from '../config';
import deepClone      from 'deep-clone';
import {redis}        from '../redis';
import moment         from 'moment';

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

    var logText = '';

    // update
    if (updatedBikePoints.length) {
        for (var i = 0; i < updatedBikePoints.length; i++) {
            logText = logText + updatedBikePoints[i].properties.id + ', ';
        }
        console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' [update] ' + logText);
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'update',
                data: updatedBikePoints.map(bikepoint.compileStream)
            })
        );
    }

    logText = '';

    // new
    var newBikePoints = newData.features.filter(row => {
        return !cache.features.find(row2 => row2.properties.id === row.properties.id);
    });

    if (newBikePoints.length) {
        for (var i = 0; i < newBikePoints.length; i++) {
            logText = logText + newBikePoints[i].properties.id + ', ';
        }
        console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' [new   ] ' + logText);
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'new',
                data: newBikePoints.map(bikepoint.compileStream)
            })
        );
    }

    logText = '';

    // deleted
    var deletedBikePoints = cache.features.filter(row => {
        return !newData.features.find(row2 => row2.properties.id === row.properties.id);
    });
    if (deletedBikePoints.length) {
        for (var i = 0; i < deletedBikePoints.length; i++) {
            logText = logText + deletedBikePoints[i].properties.id + ', ';
        }
        console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' [delete] ' + logText);
        redis.publish(
            PUB_TABLE,
            JSON.stringify({
                type: 'delete',
                data: deletedBikePoints.map(bikepoint.compileStream)
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
