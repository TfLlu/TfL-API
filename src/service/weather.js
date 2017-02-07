import * as meteolux from '../source/weather/meteolux';
import Boom          from 'boom';

export const current = async () => {
    try {
        return await meteolux.current();
    } catch (err) {
        throw new Boom.serverUnavailable('The /weather endpoint is temporarily unavailable');
    }
};
