import * as velok from '../source/bikepoint/velok';
import * as veloh from '../source/bikepoint/veloh';
import fuzzy      from 'fuzzy';
import distance   from '../helper/distance';
import inbox      from '../helper/inbox';
import Events     from 'events';
import config     from '../config';

var fuzzyOptions = {
    extract: function(obj) { return obj.properties.name + obj.properties.address + obj.properties.city; }
};

export const compileBikePoint = function(provider, bikePoint) {
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

        var bikePoints = [];

        for (let i=0; i < results.length; i++) {
            bikePoints = [
                ...bikePoints,
                ...results[i].map( bikePoint => compileBikePoint(providers[i], bikePoint))
            ];
        }

        return {
            type: 'FeatureCollection',
            features: bikePoints
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
    return compileBikePoint(bikePointSplit[0], bikePoint);
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
    results = results.map(function(res) { return res.original; });
    return {
        type: 'FeatureCollection',
        features: results
    };
};

const emitter = new Events();

export const stream = callback => {
    emitter.on('data', callback);
    if (emitter.listenerCount('data') === 1) {
        cron();
    } else {
        emitter.emit('data', {
            type: 'new',
            data: cacheData.features.map(compileStream)
        });
    }
    return {
        off: function () {
            emitter.removeListener('data', callback);
        }
    };
};

var newData = [];
var cacheData;

export const cron = async () => {
    if (emitter.listenerCount('data') === 0) {
        cacheData = null;
        return;
    }
    if (!cacheData) {
        cacheData = await all();
        emitter.emit('data', {
            type: 'new',
            data: cacheData.features.map(compileStream)
        });
        setTimeout(cron, config('STREAM_TTL_BIKEPOINT', true));
        return;
    }
    newData = await all();

    // update
    var updatedBikePoints = cacheData.features.filter(row => {
        var oldRow = newData.features.find(row2 => row2.properties.id === row.properties.id);
        return oldRow && (JSON.stringify(row) !=  JSON.stringify(oldRow));
    });

    if (updatedBikePoints.length) {
        emitter.emit('data', {
            type: 'update',
            data: updatedBikePoints.map(compileStream)
        });
    }

    // new
    var newBikePoints = newData.features.filter(row => {
        return !cacheData.features.find(row2 => row2.properties.id === row.properties.id);
    });

    if (newBikePoints.length) {
        emitter.emit('data', {
            type: 'new',
            data: newBikePoints.map(compileStream)
        });
    }

    // deleted
    var deletedBikePoints = cacheData.features.filter(row => {
        return !newData.features.find(row2 => row2.properties.id === row.properties.id);
    });
    if (deletedBikePoints.length) {
        emitter.emit('data', {
            type: 'delete',
            data: deletedBikePoints.map(compileStream)
        });
    }

    cacheData = newData;
    setTimeout(cron, config('STREAM_TTL_BIKEPOINT', true));
};


const compileStream = bikePoint => {
    return {
        id: bikePoint.properties.id,
        data: bikePoint,
    };
};
