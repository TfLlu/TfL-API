import request  from 'request-promise-native';
import config   from '../../config';

const getRaw = async () => {
    return await request(config('MOBILITEIT_STOPPOINTS', true));
};

export const load = async () => {
    var raw = await getRaw();
    var StopPoints = raw.trim().split('\n');
    return StopPoints.map(compileStopPoint);

};

const compileStopPoint = stopPoint => {
    var paramParts = stopPoint.split('@');
    var params = {};
    for (var j = 0; j < paramParts.length; j++) {
        var keyVal = paramParts[j].split('=', 2);
        params[keyVal[0]] = keyVal[1];
    }
    return{
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
                parseFloat(params.X.replace(',', '.')),
                parseFloat(params.Y.replace(',', '.'))
            ]
        },
        properties: {
            id: parseInt(params.L, 10),
            name: params.O
        }
    };
};

export const departures = async (stopPoint, maxJourneys) => {
    var requestUrl = config('MOBILITEIT_DEPARTURE', true);
    requestUrl = requestUrl.replace('{{stopPoint}}', stopPoint);
    requestUrl = requestUrl.replace('{{maxJourneys}}', maxJourneys||10);
    return await request(requestUrl);
};
