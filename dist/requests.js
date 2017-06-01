'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.luxairportArrivalsAndDepartures = exports.transitfeedsAgencies = exports.transitfeedsStopTimes = exports.transitfeedsTrips = exports.transitfeedsRoutes = exports.cita = exports.aev = exports.meteolux = exports.mobiliteitDeparture = exports.mobiliteitStoppoints = exports.vdl = exports.openov = exports.velok = exports.veloh = undefined;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const run = (name, url) => {
    return (0, _request2.default)(url, { name }).then(res => res.data);
};

const veloh = exports.veloh = bikePoint => {
    const url = bikePoint ? 'https://api.jcdecaux.com/vls/v1/stations/' + bikePoint + '?contract=Luxembourg&apiKey=' + (0, _config2.default)('API_KEY_JCD', true) : 'https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=' + (0, _config2.default)('API_KEY_JCD', true);
    return run('veloh', url);
};

const velok = exports.velok = () => {
    const url = (0, _config2.default)('URL_BIKEPOINT_VELOK', true);
    return run('velok', url);
};

const openov = exports.openov = (from, to) => {
    const url = (0, _config2.default)('URL_JOURNEY_PLANNER', true).replace('{{from}}', from).replace('{{to}}', to);
    return run('openov', url);
};

const vdl = exports.vdl = () => {
    const url = (0, _config2.default)('URL_OCCUPANCY_CARPARK_VDL', true);
    return run('vdl', url);
};

const mobiliteitStoppoints = exports.mobiliteitStoppoints = () => {
    const url = (0, _config2.default)('MOBILITEIT_STOPPOINTS', true);
    return run('mobiliteit-stoppoints', url);
};

const mobiliteitDeparture = exports.mobiliteitDeparture = (stopPoint, maxJourneys) => {
    const url = (0, _config2.default)('MOBILITEIT_DEPARTURE', true).replace('{{stopPoint}}', stopPoint).replace('{{maxJourneys}}', maxJourneys || 10);
    return run('mobiliteit-departure', url);
};

const meteolux = exports.meteolux = () => {
    const url = (0, _config2.default)('URL_WEATHER_METEOLUX', true);
    return run('meteolux', url);
};

const aev = exports.aev = measurement => {
    return _request2.default.post((0, _config2.default)('URL_WEATHER_AEV', true), _qs2.default.stringify({
        P_OPERATION: 'DATA',
        V_MEANTYPE: '1HOUR',
        V_POLLUTANT: measurement
    })).then(function (res) {
        return res.data;
    });
};

const cita = exports.cita = () => {
    const url = (0, _config2.default)('URL_HIGHWAY_CITA', true);
    return run('cita', url);
};

const transitfeedsRoutes = exports.transitfeedsRoutes = () => {
    const url = (0, _config2.default)('URL_TRANSITFEEDS_ROUTES', true);
    return run('transitfeeds', url);
};

const transitfeedsTrips = exports.transitfeedsTrips = () => {
    const url = (0, _config2.default)('URL_TRANSITFEEDS_TRIPS', true);
    return run('transitfeeds', url);
};

const transitfeedsStopTimes = exports.transitfeedsStopTimes = () => {
    const url = (0, _config2.default)('URL_TRANSITFEEDS_STOP_TIMES', true);
    return run('transitfeeds', url);
};

const transitfeedsAgencies = exports.transitfeedsAgencies = () => {
    const url = (0, _config2.default)('URL_TRANSITFEEDS_AGENCIES', true);
    return run('transitfeeds', url);
};

const luxairportArrivalsAndDepartures = exports.luxairportArrivalsAndDepartures = () => {
    const url = (0, _config2.default)('URL_LUXAIRPORT_PLANE_DEPARTURES', true);
    return run('luxairport', url);
};