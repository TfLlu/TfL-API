import { mobiliteitStoppoints, mobiliteitDeparture } from '../../requests';

export const load = async () => {
    var raw = await mobiliteitStoppoints();
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

export const departures = (stopPoint, maxJourneys) => mobiliteitDeparture(stopPoint, maxJourneys);
