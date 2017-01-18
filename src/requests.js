import config  from './config';
import request from './request';

export const veloh = bikePoint => {
    const url = bikePoint
        ? 'https://api.jcdecaux.com/vls/v1/stations/' + bikePoint + '?contract=Luxembourg&apiKey=' + config('API_KEY_JCD', true)
        : 'https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=' + config('API_KEY_JCD', true);
    return request(url)
        .then(res => res.data);
};

export const velok = () => {
    return request('https://webservice.velok.lu/stationattache.aspx')
        .then(res => res.data);
};
