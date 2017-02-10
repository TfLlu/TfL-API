import config  from './config';
import request from './request';

const run = (name, url) => {
    return request(url, { name })
        .then(res => res.data);
};

export const veloh = bikePoint => {
    const url = bikePoint
        ? 'https://api.jcdecaux.com/vls/v1/stations/' + bikePoint + '?contract=Luxembourg&apiKey=' + config('API_KEY_JCD', true)
        : 'https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=' + config('API_KEY_JCD', true);
    return run('veloh', url);
};

export const velok = () => {
    const url = config('URL_BIKEPOINT_VELOK', true);
    return run('velok', url);
};

export const openov = (from, to) => {
    const url = config('URL_JOURNEY_PLANNER', true)
        .replace('{{from}}', from)
        .replace('{{to}}', to);
    return run('openov', url);
};

export const vdl = () => {
    const url = config('URL_OCCUPANCY_CARPARK_VDL', true);
    return run('vdl', url);
};

export const mobiliteitStoppoints = () => {
    const url = config('MOBILITEIT_STOPPOINTS', true);
    return run('mobiliteit-stoppoints', url);
};

export const mobiliteitDeparture = (stopPoint, maxJourneys) => {
    const url = config('MOBILITEIT_DEPARTURE', true)
        .replace('{{stopPoint}}', stopPoint)
        .replace('{{maxJourneys}}', maxJourneys || 10);
    return run('mobiliteit-departure', url);
};

export const meteolux = () => {
    const url = config('URL_WEATHER_METEOLUX', true);
    return run('meteolux', url);
};
