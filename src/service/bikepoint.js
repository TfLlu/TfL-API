import * as velok from '../source/bikepoint/velok';
import * as veloh from '../source/bikepoint/veloh';
import request from 'request-promise-native';

export const stations = () => {

    const sources = {
        'velok': velok.stations(),
        'veloh': veloh.stations()
    };

    var providers = Object.keys(sources);

    return Promise.all(
        //TODO: replace when Issue #2 is closed
        Object.keys(sources).map(key => sources[key])
    ).then( results => {

        var stations = [];

        for (let i=0; i < results.length; i++) {
            stations = [
                ...stations,
                ...results[i].map( station => compileStation(providers[i], station))
            ];
        }

        return stations;
    });

};

export const station = async bikePoint => {
    bikePoint = bikePoint.split(':');
    return await veloh.station(bikePoint[1]);
};

export const compileStation = function(provider, station) {

    station.id = provider + ':' + station.id;

    return station;
};