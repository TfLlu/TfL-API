import * as velok from '../source/bikepoint/velok';
import * as veloh from '../source/bikepoint/veloh';
import fuzzy      from 'fuzzy';
import distance   from '../helper/distance';
import inbox      from '../helper/inbox';
import config     from '../config';
import {redis, redisPubSub} from '../redis';

const STREAM_NAME = config('NAME_VERSION', true) + '_bikepoint';

var fuzzyOptions = {
    extract: function(obj) { return obj.properties.name + obj.properties.address + obj.properties.city; }
};

export const compileBikePoint = function(provider, bikePoint) {
    bikePoint.properties.id = provider + ':' + bikePoint.properties.id;
    return bikePoint;
};

export const all = () => {
    return redis.get(config('NAME_VERSION', true) + '_cache_bikepoint')
        .then(
            function (result) {
                if (result && result !== '') {
                    return JSON.parse(result);
                } else {
                    throw new Error('no Bikepoints in Redis');
                }
            }
        );
};

export const load = () => {
    const sources = {
        'velok': velok.all(),
        'veloh': veloh.all()
    };

    var providers = Object.keys(sources);

    return Promise.all(
        //TODO: replace when Issue #2 is closed
        Object.keys(sources).map(key => sources[key])
    ).then( results => {

        var bikePoints = [];

        for (let i=0; i < results.length; i++) {
            bikePoints = [
                ...bikePoints,
                ...results[i].map( bikePoint => compileBikePoint(providers[i], bikePoint))
            ];
        }

        return {
            type: 'FeatureCollection',
            features: bikePoints
        };
    });
};

export const get = async bikePoint => {
    var bikePointSplit = bikePoint.split(':');
    switch (bikePointSplit[0]){
    case 'veloh':
        bikePoint = await veloh.get(bikePointSplit[1]);
        break;
    case 'velok':
        bikePoint = await velok.get(bikePointSplit[1]);
        break;
    }
    return compileBikePoint(bikePointSplit[0], bikePoint);
};

export const around = async (lon, lat, radius) => {
    var bikePoints = await all();
    bikePoints = bikePoints.features;

    var dist = 0;
    var bikePointsAround = [];

    for (var i = 0; i < bikePoints.length; i++) {
        var bikePoint = bikePoints[i];
        dist = distance(
            parseFloat(lon),
            parseFloat(lat),
            bikePoint.geometry.coordinates[0],
            bikePoint.geometry.coordinates[1]
        );

        if (dist <= radius) {
            bikePoint.properties.distance = parseFloat(dist.toFixed(2));
            bikePointsAround.push(bikePoint);
        }
    }
    return {
        type: 'FeatureCollection',
        features: bikePointsAround
    };

};

export const box = async (swlon, swlat, nelon, nelat) => {
    var bikePoints = await all();
    bikePoints = bikePoints.features;
    var bikePointsInBox = bikePoints.filter(function(bikePoint) {
        return inbox(
            swlon, swlat, nelon, nelat,
            bikePoint.geometry.coordinates[0],
            bikePoint.geometry.coordinates[1]
        );
    });
    return {
        type: 'FeatureCollection',
        features: bikePointsInBox
    };
};

export const search = async searchString => {
    var bikePoints = await all();
    bikePoints = bikePoints.features;

    var results = fuzzy.filter(searchString, bikePoints, fuzzyOptions);
    results = results.map(function(res) { return res.original; });
    return {
        type: 'FeatureCollection',
        features: results
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
