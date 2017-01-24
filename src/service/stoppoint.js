import * as mobiliteit from '../source/stoppoint/mobiliteit';
import fuzzy     from 'fuzzy';
import config    from '../config';
import distance  from '../helper/distance';
import inbox     from '../helper/inbox';
import cron      from 'node-cron';
import deepClone from 'deep-clone';
import moment from 'moment';

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

export const getByName = async name => {
    await cache();
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
