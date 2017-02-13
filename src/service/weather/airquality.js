import * as aev             from '../../source/weather/aev';
import config               from '../../config';
import {redis, redisPubSub} from '../../redis';
import Boom                 from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_weather_airquality';
const STREAM_NAME = config('NAME_VERSION', true) + '_weather_airquality';
const UNAVAILABLE_ERROR = new Boom.serverUnavailable('all /Weather/Airquality endpoints are temporarily unavailable');

export const load = async () => {
    try {
        return await aev.load();
    } catch (err) {
        throw UNAVAILABLE_ERROR;
    }
};

export const all = () => {
    return redis.get(CACHE_NAME)
        .then(
            function (result) {
                if (result && result !== '') {
                    return result;
                } else {
                    throw UNAVAILABLE_ERROR;
                }
            }
        )
        .catch(() => {
            throw UNAVAILABLE_ERROR;
        });
};

export const get = async weatherStation => {
    var weatherStations = JSON.parse(await all()).features;
    for (var i = 0; i < weatherStations.length; i++) {
        if (weatherStations[i].properties.id == weatherStation) {
            return weatherStations[i];
        }
    }
    throw new Boom.notFound('Weather stations [' + weatherStation + '] not found');
};

redisPubSub.subscribe(STREAM_NAME);
export const fireHose = callback => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            callback(JSON.parse(message));
        }
    };
    all().then(data => {
        data = JSON.parse(data);
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

export const streamSingle = (weatherStation, callback) => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            message = JSON.parse(message);
            for (var i = 0; i < message.data.length; i++) {
                if (message.data[i].id == weatherStation) {
                    callback({
                        type: 'update',
                        data: [compileStream(message.data[i].data)]
                    });
                }
            }
        }
    };
    all().then(data => {
        data = JSON.parse(data);
        for (var key in data.features) {
            if (data.features[key].properties.id == weatherStation) {
                callback({
                    type: 'new',
                    data: [compileStream(data.features[key])]
                });
            }
        }
    });
    redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            redisPubSub.removeListener('message', messageCallback);
        }
    };
};

export const compileStream = weatherStation => {
    return {
        id: weatherStation.properties.id,
        data: weatherStation,
    };
};
