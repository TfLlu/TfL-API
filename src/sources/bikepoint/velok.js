import request from 'request-promise-native';
import xmlParser from '../../helpers/xmlParser';

const getRaw = () => request('https://webservice.velok.lu/stationattache.aspx');

export const get = async () => {
    var raw = await getRaw();
    var data = await xmlParser(raw);

    return data['velok']['station'];
};

export const stations = async () => {
    var stations = await get();
    return stations.map(compileStation);
};

export const compileStation = station => {

    var dock_status = [];
    var attache, status, bikeType;

    for (var i = 1; i <= station.attaches; i++) {

        attache = parseInt(station['attache' + i]);

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
        id:                 parseInt(station.nstation),
        open:               station.active == 1,
        name:               station.nom,
        position: {
            longitude:      parseFloat(station.latitude),
            latitude:       parseFloat(station.longitude)
        },
        city:               station.nomlocalite,
        address:            station.lieu,
        photo:              station.urlphoto,
        docks:              parseInt(station.attaches),
        available_bikes:    parseInt(station.bikes),
        available_ebikes:   parseInt(station.ebikes),
        available_docks:    parseInt(station.libres),
        last_update:        null,
        dock_status:        dock_status

    };
};
