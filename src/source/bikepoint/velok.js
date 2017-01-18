import request   from '../../request';
import xmlParser from '../../helper/xmlParser';

const getRaw = async () => (await request('https://webservice.velok.lu/stationattache.aspx')).data;

export const loadBikePoints = async () => {
    var raw = await getRaw();
    var data = await xmlParser(raw);
    return data['velok']['station'];
};

export const all = async () => {
    var bikePoints = await loadBikePoints();
    return bikePoints.map(compileBikePoint);
};

export const get = async bikePoint => {
    var bikePoints = await loadBikePoints();
    bikePoints = bikePoints.map(compileBikePoint);
    for (var i = 0; i < bikePoints.length; i++) {
        if (bikePoints[i].properties.id == bikePoint) {
            return bikePoints[i];
        }
    }
};

export const compileBikePoint = bikePoint => {
    var dock_status = [];
    var attache, status, bikeType;
    for (var i = 1; i <= bikePoint.attaches; i++) {
        attache = parseInt(bikePoint['attache' + i]);
        switch(attache) {
        case 0:
            status = 'free';
            bikeType = null;
            break;

        case 1:
            status = 'occupied';
            bikeType = 'manual';
            break;

        case 2:
            status = 'occupied';
            bikeType = 'electric';
            break;
        }
        dock_status.push({
            status:   status,
            bikeType: bikeType
        });
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
                parseFloat(bikePoint.longitude),
                parseFloat(bikePoint.latitude)
            ]
        },
        properties: {
            id:                 parseInt(bikePoint.nstation),
            open:               bikePoint.active == 1,
            name:               bikePoint.nom,
            city:               bikePoint.nomlocalite,
            address:            bikePoint.lieu,
            photo:              bikePoint.urlphoto,
            docks:              parseInt(bikePoint.attaches),
            available_bikes:    parseInt(bikePoint.bikes),
            available_ebikes:   parseInt(bikePoint.ebikes),
            available_docks:    parseInt(bikePoint.libres),
            last_update:        null,
            dock_status:        dock_status
        }
    };
};
