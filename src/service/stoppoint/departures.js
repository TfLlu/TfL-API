import * as mobiliteit      from '../../source/stoppoint/mobiliteit';
import * as stoppoint       from '../stoppoint';
import config               from '../../config';
import moment               from 'moment';
import {redis, redisPubSub} from '../../redis';

const STREAM_NAME = config('NAME_VERSION', true) + '_stoppoint_departures';

export const get = async (stopPoint, limit) => {
    var departuresRaw = await mobiliteit.departures(stopPoint, limit);
    var departures = [];
    var rawDepartures = departuresRaw.Departure;
    if (rawDepartures) {
        for (var i = 0; i < rawDepartures.length; i++) {
            var departure = {};
            departure.id = rawDepartures[i].JourneyDetailRef.ref;
            if (!rawDepartures[i].Product.operatorCode) {
                departure.type = 'bus';
                departure.trainId = null;
            } else {
                switch (rawDepartures[i].Product.operatorCode.toLowerCase()) {
                case 'cfl':
                    departure.type = 'train';
                    departure.trainId = rawDepartures[i].Product.name.replace(/ +/g,' ');
                    break;
                default:
                    departure.type = 'bus';
                    departure.trainId = null;
                    break;
                }
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
            departure.departureISO = moment.unix(departure.departure).format();
            departure.destination = rawDepartures[i].direction;
            var destination = await stoppoint.getByName(departure.destination);
            if (typeof destination !== 'undefined') {
                departure.destinationId = destination.properties.id;
            } else {
                departure.destinationId = null;
            }
            departures.push(departure);
        }
    }

    departures.sort((a,b) => a.departure - b.departure);

    return departures;
};

export const all = () => {
    return redis.get(STREAM_NAME)
        .then(
            function (result) {
                if (result && result !== '') {
                    return JSON.parse(result);
                } else {
                    throw new Error('no StopPoints in Redis');
                }
            }
        );
};

redisPubSub.subscribe(STREAM_NAME);
export const stream = callback => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            callback(JSON.parse(message));
        }
    };
    all().then(data => {
        callback({
            type: 'new',
            data: data.features.map(compileStream)
        });
    });

    redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            redisPubSub.removeListener('message', messageCallback);
        }
    };
};

const compileStream = bikePoint => {
    return {
        id: bikePoint.properties.id,
        data: bikePoint,
    };
};
