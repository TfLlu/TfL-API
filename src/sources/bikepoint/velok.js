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

export const compileStation = item => {

    var dock_status = [];
    var attache, status, bikeType;

    for (var i = 1; i <= item.attaches; i++) {

        attache = parseInt(item['attache' + i]);

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
        id:                 parseInt(item.nstation),
        open:               item.active == 1,
        name:               item.nom,
        position: {
            longitude:      parseFloat(item.latitude),
            latitude:       parseFloat(item.longitude)
        },
        city:               item.nomlocalite,
        address:            item.lieu,
        photo:              item.urlphoto,
        docks:              parseInt(item.attaches),
        available_bikes:    parseInt(item.bikes),
        available_ebikes:   parseInt(item.ebikes),
        available_docks:    parseInt(item.libres),
        last_update:        null,
        dock_status:        dock_status

    };
};
