import * as transitfeeds from '../../source/line/transitfeeds';
import config            from '../../config';
import {redis}           from '../../redis';
import Boom              from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_line_route';
const UNAVAILABLE_ERROR = Boom.serverUnavailable('all /Line/Route endpoints are temporarily unavailable');

export const load = async () => {
    try {
        return await transitfeeds.routes();
    } catch (err) {
        throw Boom.serverUnavailable('the /Line/Route endpoint is temporarily unavailable' + err);
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

export const byLine = line => {
    return redis.get(CACHE_NAME + '_' + line)
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
            throw Boom.notFound('Line [' + line + '] not found');
        });
};
