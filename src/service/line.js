import * as transitfeeds    from '../source/line/transitfeeds';
import config               from '../config';
import {redis, redisPubSub} from '../redis';
import Boom                 from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_lines';
const STREAM_NAME = config('NAME_VERSION', true) + '_lines';
const UNAVAILABLE_ERROR = new Boom.serverUnavailable('all /Line endpoints are temporarily unavailable');

export const load = async () => {
    try {
        return await transitfeeds.load();
    } catch (err) {
        throw new Boom.serverUnavailable('the /Line endpoint is temporarily unavailable' + err);
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

export const get = async highway => {
    var highways = JSON.parse(await all());
    for (var i = 0; i < highways.length; i++) {
        if (highways[i].id == highway) {
            return highways[i];
        }
    }
    throw new Boom.notFound('Highway [' + highway + '] not found');
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
            data: data.map(compileStream)
        });
    });

    redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            redisPubSub.removeListener('message', messageCallback);
        }
    };
};

export const streamSingle = (highway, callback) => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            message = JSON.parse(message);
            for (var i = 0; i < message.data.length; i++) {
                if (message.data[i].id == highway) {
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
        for (var key in data) {
            if (data[key].id == highway) {
                callback({
                    type: 'new',
                    data: [compileStream(data[key])]
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

export const compileStream = highway => {
    return {
        id: highway.id,
        data: highway,
    };
};
