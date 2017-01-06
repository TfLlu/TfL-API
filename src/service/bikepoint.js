import * as velok from '../source/bikepoint/velok';
import * as veloh from '../source/bikepoint/veloh';
import fuzzy      from 'fuzzy';
import distance   from '../helper/distance';
import inbox      from '../helper/inbox';

var fuzzyOptions = {
    extract: function(obj) { return obj.properties.name + obj.properties.address + obj.properties.city; }
};

export const compileStation = function(provider, bikePoint) {
    bikePoint.properties.id = provider + ':' + bikePoint.properties.id;
    return bikePoint;
};

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

        return {
            type: 'FeatureCollection',
            features: stations
        };
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

export const around = async (lon, lat, radius) => {
    var bikePoints = await all();
    bikePoints = bikePoints.features;

    var dist = 0;
    var bikePointsAround = [];

    for (var i = 0; i < bikePoints.length; i++) {
        var bikePoint = bikePoints[i];
        dist = distance(
            parseFloat(lon),
            parseFloat(lat),
            bikePoint.geometry.coordinates[0],
            bikePoint.geometry.coordinates[1]
        );

        if (dist <= radius) {
            bikePoint.properties.distance = parseFloat(dist.toFixed(2));
            bikePointsAround.push(bikePoint);
        }
    }
    return {
        type: 'FeatureCollection',
        features: bikePointsAround
    };

};

export const box = async (swlon, swlat, nelon, nelat) => {
    var bikePoints = await all();
    bikePoints = bikePoints.features;
    var bikePointsInBox = bikePoints.filter(function(bikePoint) {
        return inbox(
            swlon, swlat, nelon, nelat,
            bikePoint.geometry.coordinates[0],
            bikePoint.geometry.coordinates[1]
        );
    });
    return {
        type: 'FeatureCollection',
        features: bikePointsInBox
    };
};

export const search = async searchString => {
    var bikePoints = await all();
    bikePoints = bikePoints.features;

    var results = fuzzy.filter(searchString, bikePoints, fuzzyOptions);
    return results.map(function(res) { return res.original; });
};
