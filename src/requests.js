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
    const url = 'https://webservice.velok.lu/stationattache.aspx';
    return run('velok', url);
};

export const openov = (from, to) => {
    const url = 'https://planner.tfl.lu/rrrr/plan?from-latlng=' + from + '&to-latlng=' + to;
    return run('openov', url);
};

export const vdl = () => {
    const url = 'http://service.vdl.lu/rss/circulation_guidageparking.php';
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
    const url = 'http://meteolux.lu/Opendata/data_LUX_actual.csv';
    return run('meteolux', url);
};
