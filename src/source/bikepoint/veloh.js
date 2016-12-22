import request from 'request-promise-native';
import config  from '../../config';

const getRaw = bikePoint => {
    if (typeof bikePoint === 'undefined')
        return request('https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=' + config('API_KEY_JCD', true));

    return request('https://api.jcdecaux.com/vls/v1/stations/' + bikePoint + '?contract=Luxembourg&apiKey=' + config('API_KEY_JCD', true));
};

export const get = async bikePoint => {
    var raw = await getRaw(bikePoint);
    return JSON.parse(raw);
};

export const stations = async () => {
    var stations = await get();
    return stations.map(compileStation);
};

export const station = async bikePoint => {
    var station = await get(bikePoint);
    return compileStation(station);
};

export const compileStation = station => {

    var dock_status = [];

    for (var i = 1; i <= station.available_bikes; i++) {
        dock_status.push({
            status:   'occupied',
            bikeType: 'manual'
        });
    }

    for (i = 1; i <= station.available_bike_stands; i++) {
        dock_status.push({
            status:   'free',
            bikeType: null
        });
    }

    return {
        id: station.number,
        open: station.status == 'OPEN',
        name: station.name,
        position: {
            longitude:      parseFloat(station.position.lat),
            latitude:       parseFloat(station.position.lng)
        },
        city: null,
        address: station.address,
        photo: null,
        docks: parseInt(station.bike_stands),
        available_bikes: parseInt(station.available_bikes),
        available_ebikes: null,
        available_docks: parseInt(station.available_bike_stands),
        last_update: station.last_update,
        dock_status: dock_status
    };
};
