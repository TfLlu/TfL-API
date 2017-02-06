import * as vdl from '../../source/occupancy/carpark/vdl';
import Boom     from 'boom';

export const all = () => {
    const sources = {
        'vdl': vdl.all()
    };
    var providers = Object.keys(sources);
    return Promise.all(
        //TODO: replace when Issue #2 is closed
        Object.keys(sources).map(key => sources[key])
    ).then( results => {
        var items = [];
        for (let i=0; i < results.length; i++) {
            items = [
                ...items,
                ...results[i].map( item => compileCarPark(providers[i], item))
            ];
        }
        return {
            type: 'FeatureCollection',
            features: items
        };
    }, () => {
        throw new Boom.serverUnavailable('all /Occupancy/Carpark endpoints are temporarily unavailable');
    });
};

export const get = async carPark => {
    try {
        var carParkSplit = carPark.split(':');
        var provider = carParkSplit[0];
        switch (provider){
        case 'vdl':
            carPark = await vdl.get(carParkSplit[1]);
            break;
        default:
            throw new Error('not found');
        }
        return compileCarPark(provider, carPark);
    } catch (err) {
        throw new Boom.notFound('Carpark [' + carPark + '] not found or unavailable');
    }
};

export const compileCarPark = function(provider, item) {
    item.properties.id = provider + ':' + item.properties.id;
    return item;
};
