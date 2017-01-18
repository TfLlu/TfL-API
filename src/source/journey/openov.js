import request from '../../request';

export const plan = async (from, to) => {
    return (await request('https://planner.tfl.lu/rrrr/plan?from-latlng=' + from + '&to-latlng=' + to)).data;
};
