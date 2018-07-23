import * as mobiliteit      from '../source/stoppoint/mobiliteit';
import fuzzy                from 'fuzzy';
import config               from '../config';
import distance             from '../helper/distance';
import inbox                from '../helper/inbox';
import deepClone            from 'deep-clone';
import {redis, redisPubSub} from '../redis';
import Boom                 from 'boom';

const STREAM_NAME = config('NAME_VERSION', true) + '_stoppoint';

var fuzzyOptions = {
    extract: function(obj) { return obj.properties.name; }
};

export const load = async () => {
    return {
        type: 'FeatureCollection',
        features: await mobiliteit.load()
    };

};

const getStopPointsFromRedisCache = () => {
    return redis.get(config('NAME_VERSION', true) + '_cache_stoppoint')
        .then(
            function (result) {
                if (result && result !== '') {
                    return JSON.parse(result);
                } else {
                    throw Boom.serverUnavailable('all /BikePoints endpoints are temporarily unavailable');
                }
            }
        );
};
var stopPointLoadTime = null;
var stopPointsInMemory = null;

export const all = () => {
    // every ten minutes
    if (!stopPointsInMemory || stopPointLoadTime < Date.now() - (10 * 60 * 1000)) {
        stopPointsInMemory = getStopPointsFromRedisCache();
        stopPointLoadTime = Date.now();
    }
    return stopPointsInMemory;
};

export const get = async stopPoint => {
    var stopPoints = (await all()).features;
    for (var i = 0; i < stopPoints.length; i++) {
        if (stopPoints[i].properties.id == stopPoint) {
            return stopPoints[i];
        }
    }
    throw Boom.notFound('Stop point [' + stopPoint + '] not found');
};

export const getByName = async name => {
    var stopPoints = (await all()).features;
    for (var i = 0; i < stopPoints.length; i++) {
        if (stopPoints[i].properties.name == name) {
            return stopPoints[i];
        }
    }
};

export const around = async (lon, lat, radius) => {
    var stopPoints = (await all()).features;
    var dist = 0;
    var stopPointsAround = [];

    for (var i = 0; i < stopPoints.length; i++) {
        dist = distance(
            parseFloat(lon),
            parseFloat(lat),
            stopPoints[i].geometry.coordinates[0],
            stopPoints[i].geometry.coordinates[1],
        );

        if (dist <= radius) {
            var tmpStopPoint = deepClone(stopPoints[i]);
            tmpStopPoint.properties.distance = parseFloat(dist.toFixed(2));
            stopPointsAround.push(tmpStopPoint);
        }
    }
    return {
        type: 'FeatureCollection',
        features: stopPointsAround
    };
};

export const box = async (swlon, swlat, nelon, nelat) => {
    var stopPoints = (await all()).features;
    var stopPointsInBox = stopPoints.filter(function(stopPoint) {
        return inbox(
            swlon, swlat, nelon, nelat,
            stopPoint.geometry.coordinates[0],
            stopPoint.geometry.coordinates[1],
        );
    });
    return {
        type: 'FeatureCollection',
        features: stopPointsInBox
    };
};

export const search = async searchString => {
    var stopPoints = (await all()).features;
    var results = fuzzy.filter(searchString, stopPoints, fuzzyOptions);
    var stopPointMatches = results.map(function(res) { return res.original; });

    return {
        type: 'FeatureCollection',
        features: stopPointMatches
    };
};

redisPubSub.subscribe(STREAM_NAME);
export const stream = callback => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            callback(JSON.parse(message));
        }
    };
    all().then(data => {
        callback({
            type: 'new',
            data: data.features.map(compileStream)
        });
    });

    redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            redisPubSub.removeListener('message', messageCallback);
        }
    };
};

const compileStream = bikePoint => {
    return {
        id: bikePoint.properties.id,
        data: bikePoint,
    };
};
