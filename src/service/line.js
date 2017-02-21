import * as transitfeeds from '../source/line/transitfeeds';
import config            from '../config';
import {redis}           from '../redis';
import Boom              from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_line';
const UNAVAILABLE_ERROR = new Boom.serverUnavailable('all /Line endpoints are temporarily unavailable');

export const load = async () => {
    try {
        return await transitfeeds.lines();
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

export const get = async line => {
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
            throw new Boom.notFound('Line [' + line + '] not found');
        });
};
