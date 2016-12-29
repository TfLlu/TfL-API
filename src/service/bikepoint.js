import * as velok from '../source/bikepoint/velok';
import * as veloh from '../source/bikepoint/veloh';

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
    var bikePointSplit = bikePoint.split(':');
    switch (bikePointSplit[0]){
    case 'veloh':
        bikePoint = await veloh.station(bikePointSplit[1]);
        break;
    case 'velok':
        bikePoint = await velok.station(bikePointSplit[1]);
        break;
    }
    return compileStation(bikePointSplit[0], bikePoint);
};

export const compileStation = function(provider, station) {

    station.id = provider + ':' + station.id;

    return station;
};
