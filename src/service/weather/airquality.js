import * as meteolux        from '../../source/weather/aev';
import config               from '../../config';
import {redis, redisPubSub} from '../../redis';
import Boom                 from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_airquality';
const STREAM_NAME = config('NAME_VERSION', true) + '_airquality';
const UNAVAILABLE_ERROR = new Boom.serverUnavailable('all /Weather/Airquality endpoints are temporarily unavailable');

export const current = async () => {
    try {
        return await meteolux.current();
    } catch (err) {
        throw UNAVAILABLE_ERROR;
    }
};

export const current2 = () => {
    return redis.get(CACHE_NAME)
        .then(
            function (result) {
                if (result && result !== '') {
                    return result;
                } else {
                    throw UNAVAILABLE_ERROR;
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
        data = JSON.parse(data);
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
