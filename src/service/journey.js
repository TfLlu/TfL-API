import * as openOV from '../source/journey/openov';

export const plan = async (from, to) => {
    return await openOV.plan(from, to);
};
