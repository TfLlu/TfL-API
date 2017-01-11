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

export const departures = async stopPoint => {
    var rawData = await request(config('MOBILITEIT_DEPARTURE', true) + stopPoint);
    var departures = [];
    var rawDepartures = JSON.parse(rawData).Departure;
    if (rawDepartures) {
        for (var i = 0; i < rawDepartures.length; i++) {
            var departure = {};
            switch (rawDepartures[i].Product.catCode) {
            case '2':
                departure.type = 'train';
                break;
            case '5':
                departure.type = 'bus';
                break;
            default:
                departure.type = 'unknown';
                break;
            }
            departure.line = rawDepartures[i].Product.line.trim();
            departure.number = parseInt(rawDepartures[i].Product.num.trim(), 10);

            var time = Math.round(Date.parse(rawDepartures[i].date + ' ' + rawDepartures[i].time) / 1000);
            if (rawDepartures[i].rtDate) {
                var realTime = Math.round(Date.parse(rawDepartures[i].rtDate + ' ' + rawDepartures[i].rtTime) / 1000);
                departure.departure = realTime;
                departure.delay = realTime - time;
                departure.live = true;
            } else {
                departure.departure = time;
                departure.delay = 0;
                departure.live = false;
            }
            departure.destination = rawDepartures[i].direction;
            departures.push(departure);
        }
    }
    return departures;
};
