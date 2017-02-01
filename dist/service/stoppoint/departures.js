'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stream = exports.all = exports.get = undefined;

var _mobiliteit = require('../../source/stoppoint/mobiliteit');

var mobiliteit = _interopRequireWildcard(_mobiliteit);

var _stoppoint = require('../stoppoint');

var stoppoint = _interopRequireWildcard(_stoppoint);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _redis = require('../../redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const STREAM_NAME = (0, _config2.default)('NAME_VERSION', true) + '_stoppoint_departures_*';
const CACHE_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_stoppoint_departures';

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (stopPoint, limit) {
        var departuresRaw = yield mobiliteit.departures(stopPoint, limit);
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
                            departure.trainId = rawDepartures[i].Product.name.replace(/ +/g, ' ');
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
                departure.departureISO = _moment2.default.unix(departure.departure).format();
                departure.destination = rawDepartures[i].direction;
                var destination = yield stoppoint.getByName(departure.destination);
                if (typeof destination !== 'undefined') {
                    departure.destinationId = destination.properties.id;
                } else {
                    departure.destinationId = null;
                }
                departures.push(departure);
            }
        }

        departures.sort(function (a, b) {
            return a.departure - b.departure;
        });

        return departures;
    });

    return function get(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

const all = exports.all = () => {
    return _redis.redis.get(CACHE_TABLE).then(function (result) {
        if (result && result !== '') {
            return JSON.parse(result);
        } else {
            throw new Error('no StopPoints in Redis');
        }
    });
};

_redis.redisPubSub.psubscribe(STREAM_NAME);
const stream = exports.stream = callback => {
    const messageCallback = (pattern, channel, message) => {
        if (pattern === STREAM_NAME) {
            callback(JSON.parse(message));
        }
    };
    all().then(data => {
        callback({
            type: 'new',
            data: data
        });
    });
    _redis.redisPubSub.on('pmessage', messageCallback);

    return {
        off: function () {
            _redis.redisPubSub.removeListener('message', messageCallback);
        }
    };
};