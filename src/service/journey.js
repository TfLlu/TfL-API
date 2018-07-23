import * as openOV from '../source/journey/openov';
import Boom        from 'boom';

export const plan = async (from, to) => {
    try {
        return await openOV.plan(from, to);
    } catch (boom) {
        throw Boom.serverUnavailable('The Journey planner is temporarily unavailable');
    }
};
