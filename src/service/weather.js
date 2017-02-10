import * as meteolux        from '../source/weather/meteolux';
import config               from '../config';
import {redis, redisPubSub} from '../redis';
import Boom                 from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_weather';
const STREAM_NAME = config('NAME_VERSION', true) + '_weather';

export const load = async () => {
    try {
        return await meteolux.current();
    } catch (err) {
        throw new Boom.serverUnavailable('The /weather endpoint is temporarily unavailable');
    }
};

export const current = () => {
    return redis.get(CACHE_NAME)
        .then(
            function (result) {
                if (result && result !== '') {
                    return JSON.parse(result);
                } else {
                    throw new Boom.serverUnavailable('the /Weather endpoint is temporarily unavailable');
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
    current().then(data => {
        callback({
            type: 'new',
            data: data
        });
    });

    redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            redisPubSub.removeListener('message', messageCallback);
        }
    };
};
