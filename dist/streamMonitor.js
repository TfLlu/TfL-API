'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _influxdbNodejs = require('influxdb-nodejs');

var _influxdbNodejs2 = _interopRequireDefault(_influxdbNodejs);

var _redis = require('./redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const STREAM_CLIENTS_KEY = (0, _config2.default)('NAME_VERSION', true) + '_stream_clients_';

var influxdb = false;

const streamCountToInflux = () => {

    const sources = {
        departures: _redis.redis.get(STREAM_CLIENTS_KEY + 'stoppoint_departures'),
        bikepoint: _redis.redis.get(STREAM_CLIENTS_KEY + 'bikepoint'),
        carpark: _redis.redis.get(STREAM_CLIENTS_KEY + 'occupancy_carpark'),
        weather: _redis.redis.get(STREAM_CLIENTS_KEY + 'weather'),
        airquality: _redis.redis.get(STREAM_CLIENTS_KEY + 'weather_airquality')
    };

    var sourceName = Object.keys(sources);

    return Promise.all(
    //TODO: replace when Issue #2 is closed
    Object.keys(sources).map(key => sources[key])).then(results => {

        var data = {};

        for (let i = 0; i < results.length; i++) {
            data[sourceName[i]] = parseInt(results[i]);
        }
        influxdb.write('streamConnections').field(data).then();
    }).catch(err => {
        console.error(err);
    });
};

if ((0, _config2.default)('INFLUXDB')) {
    influxdb = new _influxdbNodejs2.default((0, _config2.default)('INFLUXDB') + (0, _config2.default)('NAME_VERSION'));
    setInterval(streamCountToInflux, 10000);
}