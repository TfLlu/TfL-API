import * as mobiliteit      from '../source/stoppoint/mobiliteit';
import fuzzy                from 'fuzzy';
import config               from '../config';
import distance             from '../helper/distance';
import inbox                from '../helper/inbox';
import deepClone            from 'deep-clone';
import moment               from 'moment';
import {redis, redisPubSub} from '../redis';

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

export const all = () => {
    return redis.get(config('NAME_VERSION', true) + '_cache_stoppoint')
        .then(
            function (result) {
                if (result && result !== '') {
                    return JSON.parse(result);
                } else {
                    throw new Error('no StopPoints in Redis');
                }
            }
        );
};

export const get = async stopPoint => {
    var stopPoints = (await all()).features;
    for (var i = 0; i < stopPoints.length; i++) {
        if (stopPoints[i].properties.id == stopPoint) {
            return stopPoints[i];
        }
    }
};

export const getByName = async name => {
    var stopPoints = (await all()).features;
    for (var i = 0; i < stopPoints.length; i++) {
        if (stopPoints[i].properties.name == name) {
            return stopPoints[i];
        }
    }
};

export const departures = async (stopPoint, limit) => {
    var departuresRaw = await mobiliteit.departures(stopPoint, limit);
    var departures = [];
    var rawDepartures = departuresRaw.Departure;
    if (rawDepartures) {
        for (var i = 0; i < rawDepartures.length; i++) {
            var departure = {};
            if (!rawDepartures[i].Product.operatorCode) {
                departure.type = 'bus';
                departure.trainId = null;
            } else {
                switch (rawDepartures[i].Product.operatorCode.toLowerCase()) {
                case 'cfl':
                    departure.type = 'train';
                    departure.trainId = rawDepartures[i].Product.name.replace(/ +/g,' ');
                    break;
                default:
                    departure.type = 'bus';
                    departure.trainId = null;
                    break;
                }
            }
            departure.line = rawDepartures[i].Product.line.trim();
            departure.number = parseInt(rawDepartures[i].Product.num.trim(), 10);

            var time = Math.round(Date.parse(rawDepartures[i].date + ' ' + rawDepartures[i].time) / 1000);
            if (rawDepartures[i].rtDate) {
                var realTime = Math.round(Date.parse(rawDepartures[i].rtDate + ' ' + rawDepartures[i].rtTime) / 1000);
                departure.departure = realTime;
                departure.delay = realTime - time;
                departure.live = true;
            } else {
                departure.departure = time;
                departure.delay = 0;
                departure.live = false;
            }
            departure.departureISO = moment.unix(departure.departure).format();
            departure.destination = rawDepartures[i].direction;
            var destination = await getByName(departure.destination);
            if (typeof destination !== 'undefined') {
                departure.destinationId = destination.properties.id;
            } else {
                departure.destinationId = null;
            }
            departures.push(departure);
        }
    }
    return departures;
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
