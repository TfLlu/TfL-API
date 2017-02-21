import config            from '../../config';
import {redis}           from '../../redis';
import Boom              from 'boom';

const CACHE_NAME       = config('NAME_VERSION', true) + '_cache_line_mode_';
const CACHE_MODE_TABLE = config('NAME_VERSION', true) + '_cache_line_route_mode_';
const UNAVAILABLE_ERROR = new Boom.serverUnavailable('all /Line/Mode endpoints are temporarily unavailable');

export const get = mode => {
    return redis.get(CACHE_NAME + mode)
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
            throw new Boom.notFound('Mode [' + mode + '] not found');
        });
};

export const getRoutes = mode => {
    return redis.get(CACHE_MODE_TABLE + mode)
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
            throw new Boom.notFound('Mode [' + mode + '] not found');
        });
};
