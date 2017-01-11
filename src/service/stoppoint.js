import * as mobiliteit from '../source/stoppoint/mobiliteit';
import fuzzy     from 'fuzzy';
import config    from '../config';
import distance  from '../helper/distance';
import inbox     from '../helper/inbox';
import cron      from 'node-cron';
import deepClone from 'deep-clone';

var fuzzyOptions = {
    extract: function(obj) { return obj.properties.name; }
};

var stopPoints = [];

cron.schedule(config('MOBILITEIT_REFRESH_CRON', true), function(){
    loadStoppoints();
});

const loadStoppoints = async () => {
    stopPoints = await mobiliteit.load();
};

const cache = async () => {
    if (stopPoints.length === 0) {
        await loadStoppoints();
    }
};

export const all = async () => {
    await cache();
    return {
        type: 'FeatureCollection',
        features: stopPoints
    };
};

export const get = async stopPoint => {
    await cache();
    for (var i = 0; i < stopPoints.length; i++) {
        if (stopPoints[i].properties.id == stopPoint) {
            return stopPoints[i];
        }
    }
};

export const departures = async stopPoint => {
    return await mobiliteit.departures(stopPoint);
};

export const around = async (lon, lat, radius) => {
    await cache();
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
    await cache();
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
    await cache();

    var results = fuzzy.filter(searchString, stopPoints, fuzzyOptions);
    var stopPointMatches = results.map(function(res) { return res.original; });

    return {
        type: 'FeatureCollection',
        features: stopPointMatches
    };
};
