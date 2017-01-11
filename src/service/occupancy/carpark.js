import * as vdl from '../../source/occupancy/carpark/vdl';

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
    });
};

export const get = async carPark => {
    var carParkSplit = carPark.split(':');
    var provider = carParkSplit[0];
    switch (provider){
    case 'vdl':
        carPark = await vdl.get(carParkSplit[1]);
        break;
    default:
        //TODO: implement not found
        return false;
    }
    return compileCarPark(provider, carPark);
};

export const compileCarPark = function(provider, item) {
    item.properties.id = provider + ':' + item.properties.id;
    return item;
};
