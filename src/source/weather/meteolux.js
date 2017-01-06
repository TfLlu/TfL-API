import request from 'request-promise-native';

const getRaw = () => {
    return request('http://meteolux.lu/Opendata/data_LUX_actual.csv');
};

export const get = async bikePoint => {

    var raw = await getRaw(bikePoint);
    var lines = raw.trim().split('\r\n');
    var result = {};

    for (var i = 0; i < lines.length; i++) {
        var lineParts = lines[i].split(';');

        result[lineParts[0]] = lineParts[1];
    }

    return result;
};

export const current = async () => {
    var situation = await get();
    return compileSituation(situation);
};

export const compileSituation = situation => {

    var windDirection = '';

    switch(situation.wind_direction_text.toUpperCase()) {
    case 'NORD':
        windDirection = 360;
        break;
    case 'NE':
        windDirection = 45;
        break;
    case 'EST':
        windDirection = 90;
        break;
    case 'SE':
        windDirection = 135;
        break;
    case 'SUD':
        windDirection = 180;
        break;
    case 'SO':
        windDirection = 225;
        break;
    case 'OUEST':
        windDirection = 270;
        break;
    case 'NO':
        windDirection = 315;
        break;
    }

    var visibility = parseInt(situation.visibility);

    if (situation.visibility.indexOf('km') !== -1) {
        visibility = visibility * 1000;
    }

    return {
        coord: {
            lat: 49.627688,
            lon: 6.223234
        },
        weather: [
            {
                id: null,
                main: null,
                description: situation.weather,
                icon: null
            }
        ],
        base: null,
        main: {
            temp:     parseInt(situation.temp),
            pressure: parseInt(situation.pressure),
            humidity: parseInt(situation.humidity),
            temp_min: null,
            temp_max: null
        },
        visibility: visibility,
        wind: {
            speed: parseInt(situation.wind_force),
            deg:   windDirection
        },
        clouds: {
            all: null
        },
        dt: Math.round(new Date().getTime()/1000),
        sys: {
            type: null,
            id: null,
            message: null,
            country: null,
            sunrise: null,
            sunset: null
        },
        id: null,
        name: 'Findel',
        cod: 200
    };
};
