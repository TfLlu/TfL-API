import config  from './config';
import Influx  from 'influxdb-nodejs';
import {redis} from './redis';

const STREAM_CLIENTS_KEY = config('NAME_VERSION', true) + '_stream_clients_';

var influxdb = false;

const streamCountToInflux = () => {

    const sources = {
        departures: redis.get(STREAM_CLIENTS_KEY + 'stoppoint_departures'),
        bikepoint:  redis.get(STREAM_CLIENTS_KEY + 'bikepoint'),
        carpark:    redis.get(STREAM_CLIENTS_KEY + 'occupancy_carpark'),
        weather:    redis.get(STREAM_CLIENTS_KEY + 'weather'),
        airquality: redis.get(STREAM_CLIENTS_KEY + 'weather_airquality')
    };

    var sourceName = Object.keys(sources);

    return Promise.all(
        //TODO: replace when Issue #2 is closed
        Object.keys(sources).map(key => sources[key])
    ).then( results => {

        var data = {};

        for (let i=0; i < results.length; i++) {
            data[sourceName[i]] = parseInt(results[i]);
        }
        influxdb.write('streamConnections')
            .field(data)
            .then();
    })
    .catch(err => {
        console.error(err);
    });
};

if (config('INFLUXDB')) {
    influxdb = new Influx(config('INFLUXDB') + config('NAME_VERSION'));
    setInterval(streamCountToInflux, 10000);
}
