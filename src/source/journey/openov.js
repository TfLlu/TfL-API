import request from 'request-promise-native';

export const plan = (from, to) => {
    return request('https://planner.tfl.lu/rrrr/plan?from-latlng=' + from + '&to-latlng=' + to);
};
