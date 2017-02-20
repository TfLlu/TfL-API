import { cita }  from '../../requests';
import xmlParser from '../../helper/xmlParser';

export const load = async () => {
    var raw = await cita();
    var data = await xmlParser(raw);
    return data['kml']['Document']['Folder']['Placemark'];
};

export const all = async () => {
    var highwayInfo = await load();
    var highways = highwayInfo.map(compileHighwayInfo);
    var res = [];
    for (let i = 0; i < highways.length;i++) {
        let highway = highways[i];
        let inRes = false;
        for (let j = 0; j < res.length; j++) {
            if (res[j].id == highway.id) {
                res[j].transitTimes.push(...highway.transitTimes);
                inRes = true;
            }
        }
        if (!inRes) {
            res.push(highway);
        }
    }

    return res;
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
    var id = null;
    switch(highwayInfo.name.toLowerCase()) {
    case 'senningerberg':
    case 'wasserbillig':
        id = 'A1';
        break;
    case 'france':
    case 'lux-sud':
        id = 'A3';
        break;
    case 'lallange':
    case 'merl':
        id = 'A4';
        break;
    case 'belgique':
    case 'bridel':
        id = 'A6';
        break;
    case 'schieren':
    case 'mersch':
        id = 'A7';
        break;
    case 'schengen':
        id = 'A13';
        break;
    }

    var fluidityRaw = highwayInfo.description.split('</span>');
    var transitTimes = {};
    var fluidity, destination, time;

    for(var i=0; i < fluidityRaw.length; i++) {
        fluidity = /time'>(.*?)\:\s(.*)/g.exec(fluidityRaw[i]);
        if (fluidity === null) {
            continue;
        }
        destination = fluidity[1].toLowerCase();
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
        id: 'cita:'+id,
        transitTimes: [
            {
                origin:       highwayInfo.name.toLowerCase(),
                destinations: transitTimes
            }
        ]
    };
};
