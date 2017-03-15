import * as transitfeeds from '../source/line/transitfeeds';
import config            from '../config';
import {redis}           from '../redis';
import Boom              from 'boom';

const CACHE_NAME  = config('NAME_VERSION', true) + '_cache_agencies';
const UNAVAILABLE_ERROR = new Boom.serverUnavailable('agencies are temporarily unavailable');

export const load = async () => {
    try {
        return await transitfeeds.agencies();
    } catch (err) {
        throw new Boom.serverUnavailable('agencies are temporarily unavailable' + err);
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
