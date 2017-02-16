import { cita }  from '../../requests';
import xmlParser from '../../helper/xmlParser';

export const load = async () => {
    var raw = await cita();
    var data = await xmlParser(raw);
    return data['kml']['Document']['Folder']['Placemark'];
};

export const all = async () => {
    var highwayInfo = await load();
    var items = highwayInfo.map(compileHighwayInfo);
    return{
        type: 'FeatureCollection',
        features: items
    };
};

export const get = async carPark => {
    var carParks = await load();
    carParks = carParks.map(compileHighwayInfo);
    for (var i = 0; i < carParks.length; i++) {
        if (carParks[i].properties.id == carPark) {
            return carParks[i];
        }
    }
};

export const compileHighwayInfo = highwayInfo => {

    var highway = null;

    switch(highwayInfo.name.toLowerCase()) {
    case 'senningerberg':
    case 'wasserbillig':
        highway = 1;
        break;
    case 'france':
    case 'lux-sud':
        highway = 3;
        break;
    case 'lallange':
    case 'merl':
        highway = 4;
        break;
    case 'belgique':
    case 'bridel':
        highway = 6;
        break;
    case 'schieren':
    case 'mersch':
        highway = 7;
        break;
    case 'schengen':
        highway = 13;
        break;
    }

    var coordinates = /([\d\.]+),([\d\.]+)/g.exec(highwayInfo.Point.coordinates);
    var fluidityRaw = highwayInfo.description.split('</span>');
    var transitTimes = {};
    var fluidity, destination, time;

    for(var i=0; i < fluidityRaw.length; i++) {
        fluidity = /time'>(.*?)\:\s(.*)/g.exec(fluidityRaw[i]);
        if (fluidity === null) {
            continue;
        }
        destination = fluidity[1];
        time = fluidity[2];
        if (time.indexOf('min') === -1) {
            time = null;
        } else {
            time = /(\d+)min/g.exec(time);
            time = parseInt(time[1]) * 60;
        }
        transitTimes[destination] = time;
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
                Math.round(parseFloat(coordinates[1]) * 1000000) / 1000000,
                Math.round(parseFloat(coordinates[2]) * 1000000) / 1000000
            ]
        },
        properties: {
            id:           parseInt(/ID_(\d+)/g.exec(highwayInfo['$'].id)[1]),
            highway:      highway,
            transitTimes: transitTimes
        }
    };
};
