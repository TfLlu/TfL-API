'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.load = exports.arrivals = exports.departures = undefined;

var _luxairport = require('../source/airport/luxairport');

var luxairport = _interopRequireWildcard(_luxairport);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../redis');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CACHE_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_airport_';

const departures = exports.departures = (() => {
    var _ref = _asyncToGenerator(function* () {
        return _redis.redis.get(CACHE_TABLE + 'departures').then(function (result) {
            if (result && result !== '') {
                return result;
            } else {
                throw new _boom2.default.serverUnavailable('Airport departures are temporarily unavailable');
            }
        });
    });

    return function departures() {
        return _ref.apply(this, arguments);
    };
})();

const arrivals = exports.arrivals = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        return _redis.redis.get(CACHE_TABLE + 'arrivals').then(function (result) {
            if (result && result !== '') {
                return result;
            } else {
                throw new _boom2.default.serverUnavailable('Airport arrivals are temporarily unavailable');
            }
        });
    });

    return function arrivals() {
        return _ref2.apply(this, arguments);
    };
})();

const load = exports.load = (() => {
    var _ref3 = _asyncToGenerator(function* () {
        return yield luxairport.load();
    });

    return function load() {
        return _ref3.apply(this, arguments);
    };
})();