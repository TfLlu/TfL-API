import * as parkingVDL from '../../source/occupancy/carpark/vdl';

export const items = () => {

    const sources = {
        'carparkVDL': parkingVDL.items()
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
                ...results[i].map( item => compileStation(providers[i], item))
            ];
        }

        return items;
    });

};

export const item = async item => {
    item = item.split(':');
    return await parkingVDL.item(item[1]);
};

export const compileStation = function(provider, item) {

    item.id = provider + ':' + item.id;

    return item;
};
