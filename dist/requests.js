'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.meteolux = exports.mobiliteitDeparture = exports.mobiliteitStoppoints = exports.vdl = exports.openov = exports.velok = exports.veloh = undefined;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const run = (name, url) => {
    return (0, _request2.default)(url, { name }).then(res => res.data);
};

const veloh = exports.veloh = bikePoint => {
    const url = bikePoint ? 'https://api.jcdecaux.com/vls/v1/stations/' + bikePoint + '?contract=Luxembourg&apiKey=' + (0, _config2.default)('API_KEY_JCD', true) : 'https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=' + (0, _config2.default)('API_KEY_JCD', true);
    return run('veloh', url);
};

const velok = exports.velok = () => {
    const url = 'https://webservice.velok.lu/stationattache.aspx';
    return run('velok', url);
};

const openov = exports.openov = (from, to) => {
    const url = 'https://planner.tfl.lu/rrrr/plan?from-latlng=' + from + '&to-latlng=' + to;
    return run('openov', url);
};

const vdl = exports.vdl = () => {
    const url = 'http://service.vdl.lu/rss/circulation_guidageparking.php';
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
    const url = 'http://meteolux.lu/Opendata/data_LUX_actual.csv';
    return run('meteolux', url);
};