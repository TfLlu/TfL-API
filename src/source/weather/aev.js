import { aev } from '../../requests';
import luref   from '../../helper/luref';
import moment  from 'moment';

export const get = async (measurment) => {
    var raw = await aev(measurment);
    var rawData = /<DATA_RESULT>([^<]*)<\/DATA_RESULT>/g.exec(raw)[1].split('|');
    var data = [];
    for (var i=0; i< rawData.length; i++) {
        if (rawData[i].indexOf(';') !== -1) {
            data.push(rawData[i]);
        }
    }
    return data;
};

export const load = async () => {
    const data = {
        'temp': get('TE-degreC'),
        'pm10': get('PM10-microg/m3'),
        'no2':  get('NO2-microg/m3'),
        'o3':   get('O3-microg/m3'),
        'so2':  get('SO2-microg/m3'),
        'co':   get('CO-mg/m3')
    };

    var sources = Object.keys(data);

    return Promise.all(
        //TODO: replace when Issue #2 is closed
        Object.keys(data).map(key => data[key])
    ).then( results => {
        var tmpStations = {};
        for (let i=0; i < results.length; i++) {
            var measurments = results[i];

            for(let j=0; j < measurments.length; j++) {
                var measurment = measurments[j].split(';');

                // remove special characters from name
                var id = measurment[0].replace(/-/g,'').replace(/[\s&\/\\#,+()$~%.'":*?<>{}]/g,'-');

                if (!tmpStations[id]) {
                    tmpStations[id] = {
                        coordinates: [
                            luref(measurment[5]),
                            luref(measurment[6])
                        ]
                    };
                }
                var last_update = moment(measurment[1] + ' +0000', 'YYYYMMDDHHmm Z').format('x');
                if (!tmpStations[id].last_update || last_update > tmpStations[id].last_update) {
                    tmpStations[id].last_update = last_update;
                }
                tmpStations[id][sources[i]] = parseFloat(measurment[3]);
            }
        }

        var stations = [];

        for (var key in tmpStations) {
            if (tmpStations.hasOwnProperty(key)) {
                stations.push(compileWeatherStation(key, tmpStations[key]));
            }
        }

        return {
            type: 'FeatureCollection',
            features: stations
        };

    });
};

export const compileWeatherStation = (name, weatherStation) => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: weatherStation.coordinates
        },
        properties: {
            id:          'aev:' + name,
            name:        name,
            temp:        weatherStation.temp        || null,
            pm10:        weatherStation.pm10        || null,
            no2:         weatherStation.no2         || null,
            o3:          weatherStation.o3          || null,
            so2:         weatherStation.so2         || null,
            co:          weatherStation.co          || null,
            last_update: weatherStation.last_update || null
        }
    };
};
