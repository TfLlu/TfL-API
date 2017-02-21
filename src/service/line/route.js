import * as transitfeeds from '../../source/line/transitfeeds';
import config            from '../../config';
import {redis}           from '../../redis';
import Boom              from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_line_route';
const UNAVAILABLE_ERROR = new Boom.serverUnavailable('all /Line/Route endpoints are temporarily unavailable');

export const load = async () => {
    try {
        return await transitfeeds.routes();
    } catch (err) {
        throw new Boom.serverUnavailable('the /Line/Route endpoint is temporarily unavailable' + err);
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
