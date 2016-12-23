import request from 'request-promise-native';

const getRaw = () => {
    return request('http://travelplanner.mobiliteit.lu/hafas/query.exe/dot?performLocating=2&tpl=stop2csv&look_maxdist=150000&look_x=6112550&look_y=49610700&stationProxy=yes');
};

export const get = async bikePoint => {

    var raw = await getRaw(bikePoint);
    var stations = raw.trim().split('\n');
    var result = [];

    for (var i = 0; i < stations.length; i++) {
        var paramParts = stations[i].split('@');
        var params = {};
        for (var j = 0; j < paramParts.length; j++) {
            var keyVal = paramParts[j].split('=', 2);
            params[keyVal[0]] = keyVal[1];
        }
        result.push({
            id: parseInt(params.L, 10),
            name: params.O,
            longitude: parseFloat(params.X.replace(',', '.')),
            latitude: parseFloat(params.Y.replace(',', '.'))
        });
    }

    return result;
};

export const points = async () => {
    var stations = await get();
    return stations.map(compileStation);
};

export const station = async bikePoint => {
    var station = await get(bikePoint);
    return compileStation(station);
};

export const compileStation = station => {
    return station;
};
