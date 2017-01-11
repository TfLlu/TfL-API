'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.departures = exports.load = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = (() => {
    var _ref = _asyncToGenerator(function* () {
        return yield (0, _requestPromiseNative2.default)((0, _config2.default)('MOBILITEIT_STOPPOINTS', true));
    });

    return function getRaw() {
        return _ref.apply(this, arguments);
    };
})();

const load = exports.load = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var raw = yield getRaw();
        var rawStopPoints = raw.trim().split('\n');
        var newStopPoints = [];

        for (var i = 0; i < rawStopPoints.length; i++) {
            var paramParts = rawStopPoints[i].split('@');
            var params = {};
            for (var j = 0; j < paramParts.length; j++) {
                var keyVal = paramParts[j].split('=', 2);
                params[keyVal[0]] = keyVal[1];
            }
            newStopPoints.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(params.X.replace(',', '.')), parseFloat(params.Y.replace(',', '.'))]
                },
                properties: {
                    id: parseInt(params.L, 10),
                    name: params.O
                }
            });
        }
        return newStopPoints;
    });

    return function load() {
        return _ref2.apply(this, arguments);
    };
})();

const departures = exports.departures = (() => {
    var _ref3 = _asyncToGenerator(function* (stopPoint) {
        var rawData = yield (0, _requestPromiseNative2.default)((0, _config2.default)('MOBILITEIT_DEPARTURE', true) + stopPoint);
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
    });

    return function departures(_x) {
        return _ref3.apply(this, arguments);
    };
})();