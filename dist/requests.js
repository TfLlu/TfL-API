'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.velok = exports.veloh = undefined;

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