import * as velok from '../source/bikepoint/velok';
import * as veloh from '../source/bikepoint/veloh';

export const all = () => {

    const sources = {
        'velok': velok.all(),
        'veloh': veloh.all()
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

export const get = async bikePoint => {
    var bikePointSplit = bikePoint.split(':');
    switch (bikePointSplit[0]){
    case 'veloh':
        bikePoint = await veloh.get(bikePointSplit[1]);
        break;
    case 'velok':
        bikePoint = await velok.get(bikePointSplit[1]);
        break;
    }
    return compileStation(bikePointSplit[0], bikePoint);
};

export const compileStation = function(provider, bikePoint) {
    bikePoint.id = provider + ':' + bikePoint.id;
    return bikePoint;
};
