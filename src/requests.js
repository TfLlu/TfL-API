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
