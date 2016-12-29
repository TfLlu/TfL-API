import request  from 'request-promise-native';
import config   from '../../config';
import distance from '../../helper/distance';
import inbox    from '../../helper/inbox';
var cron = require('node-cron');

var stopPoints = [];

const getRaw = () => {
    return request(config('MOBILITEIT_STOPPOINTS', true));
};

cron.schedule(config('MOBILITEIT_REFRESH_CRON', true), function(){
    loadStoppoints();
});

const loadStoppoints = async () => {
    stopPoints = await load();
};

export const load = async () => {
    var raw = await getRaw();
    var stations = raw.trim().split('\n');
    var newStopPoints = [];

    for (var i = 0; i < stations.length; i++) {
        var paramParts = stations[i].split('@');
        var params = {};
        for (var j = 0; j < paramParts.length; j++) {
            var keyVal = paramParts[j].split('=', 2);
            params[keyVal[0]] = keyVal[1];
        }
        newStopPoints.push({
            id: parseInt(params.L, 10),
            name: params.O,
            longitude: parseFloat(params.X.replace(',', '.')),
            latitude: parseFloat(params.Y.replace(',', '.'))
        });
    }
    return newStopPoints;
};

const cache = async () => {
    if (stopPoints.length === 0) {
        await loadStoppoints();
    }
};

export const all = async () => {
    await cache();
    return stopPoints;
};

export const get = async stopPoint => {
    await cache();
    for (var i = 0; i < stopPoints.length; i++) {
        if (stopPoints[i].id == stopPoint) {
            return stopPoints[i];
        }
    }
    return false;
};

export const around = async (lon, lat, radius) => {
    await cache();
    var dist = 0;
    var stopPointsAround = [];

    for (var i = 0; i < stopPoints.length; i++) {
        dist = distance(
            parseFloat(lon),
            parseFloat(lat),
            stopPoints[i].longitude,
            stopPoints[i].latitude
        );

        if (dist <= radius) {
            var temp = stopPoints[i];
            temp.distance = parseFloat(dist.toFixed(2));
            stopPointsAround.push(temp);
        }
    }
    return stopPointsAround;
};

export const box = async (swlon, swlat, nelon, nelat) => {
    await cache();
    var whybox = false;
    return stopPoints.filter(function(stopPoint) {
        whybox = inbox(
            swlon, swlat, nelon, nelat,
            stopPoint.longitude,
            stopPoint.latitude
        );
        return whybox;
    });
};
