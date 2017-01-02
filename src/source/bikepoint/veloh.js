import request from 'request-promise-native';
import config  from '../../config';

const getRaw = bikePoint => {
    if (typeof bikePoint === 'undefined')
        return request('https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=' + config('API_KEY_JCD', true));
    return request('https://api.jcdecaux.com/vls/v1/stations/' + bikePoint + '?contract=Luxembourg&apiKey=' + config('API_KEY_JCD', true));
};

export const loadBikePoints = async bikePoint => JSON.parse(await getRaw(bikePoint));

export const all = async () => {
    var bikePoints = await loadBikePoints();
    return bikePoints.map(compileStation);
};

export const get = async bikePointId => {
    var bikePoint = await loadBikePoints(bikePointId);
    return compileStation(bikePoint);
};

export const compileStation = bikePoint => {

    var dock_status = [];

    for (var i = 1; i <= bikePoint.available_bikes; i++) {
        dock_status.push({
            status:   'occupied',
            bikeType: 'manual'
        });
    }

    for (i = 1; i <= bikePoint.available_bike_stands; i++) {
        dock_status.push({
            status:   'free',
            bikeType: null
        });
    }

    return {
        id: bikePoint.number,
        open: bikePoint.status == 'OPEN',
        name: bikePoint.name,
        position: {
            longitude:      parseFloat(bikePoint.position.lng),
            latitude:       parseFloat(bikePoint.position.lat)
        },
        city: null,
        address: bikePoint.address,
        photo: null,
        docks: parseInt(bikePoint.bike_stands),
        available_bikes: parseInt(bikePoint.available_bikes),
        available_ebikes: null,
        available_docks: parseInt(bikePoint.available_bike_stands),
        last_update: bikePoint.last_update,
        dock_status: dock_status
    };
};
