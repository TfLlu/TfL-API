import * as vdl             from '../../source/occupancy/carpark/vdl';
import config               from '../../config';
import {redis, redisPubSub} from '../../redis';
import Boom                 from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_occupancy_carpark';
const STREAM_NAME = config('NAME_VERSION', true) + '_occupancy_carpark';

export const all = () => {
    return redis.get(CACHE_NAME)
        .then(
            function (result) {
                if (result && result !== '') {
                    return result;
                } else {
                    throw new Boom.serverUnavailable('all /Occupancy/CarPark endpoints are temporarily unavailable');
                }
            }
        );
};

export const load = () => {
    const sources = {
        'vdl': vdl.all()
    };
    var providers = Object.keys(sources);
    return Promise.all(
        //TODO: replace when Issue #2 is closed
        Object.keys(sources).map(key => sources[key])
    ).then( results => {
        var items = [];
        for (let i=0; i < results.length; i++) {
            items = [
                ...items,
                ...results[i].map( item => compileCarPark(providers[i], item))
            ];
        }
        return {
            type: 'FeatureCollection',
            features: items
        };
    }, () => {
        throw new Boom.serverUnavailable('all /Occupancy/Carpark endpoints are temporarily unavailable');
    });
};

export const get = async carPark => {
    return redis.get(CACHE_NAME + '_' + carPark)
        .then(
            function (result) {
                if (result && result !== '') {
                    return result;
                } else {
                    throw new Boom.serverUnavailable('Data from carpark [' + carPark + '] is temporarily unavailable');
                }
            }
        );
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

export const streamSingle = (carPark, callback) => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            message = JSON.parse(message);
            for (var i = 0; i < message.data.length; i++) {
                if (message.data[i].id == carPark) {
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
            if (data.features[key].properties.id == carPark) {
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

export const compileStream = carpark => {
    return {
        id: carpark.properties.id,
        data: carpark,
    };
};

export const compileCarPark = function(provider, item) {
    item.properties.id = provider + ':' + item.properties.id;
    return item;
};
