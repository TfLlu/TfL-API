import * as luxairport from '../source/airport/luxairport';
import config          from '../config';
import {redis}         from '../redis';
import Boom            from 'boom';

const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_airport_';

export const departures = async () => {
    return redis.get(CACHE_TABLE + 'departures')
        .then(
            function (result) {
                if (result && result !== '') {
                    return result;
                } else {
                    throw Boom.serverUnavailable('Airport departures are temporarily unavailable');
                }
            }
        );
};

export const arrivals = async () => {
    return redis.get(CACHE_TABLE + 'arrivals')
        .then(
            function (result) {
                if (result && result !== '') {
                    return result;
                } else {
                    throw Boom.serverUnavailable('Airport arrivals are temporarily unavailable');
                }
            }
        );
};

export const load = async () => {
    return await luxairport.load();
};
