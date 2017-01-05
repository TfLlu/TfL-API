'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = exports.box = exports.around = exports.get = exports.all = exports.load = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _fuzzy = require('fuzzy');

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _distance = require('../../helper/distance');

var _distance2 = _interopRequireDefault(_distance);

var _inbox = require('../../helper/inbox');

var _inbox2 = _interopRequireDefault(_inbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var cron = require('node-cron');

var stopPoints = [];
var fuzzyOptions = {
    extract: function (obj) {
        return obj.name;
    }
};

const getRaw = (() => {
    var _ref = _asyncToGenerator(function* () {
        return yield (0, _requestPromiseNative2.default)((0, _config2.default)('MOBILITEIT_STOPPOINTS', true));
    });

    return function getRaw() {
        return _ref.apply(this, arguments);
    };
})();

cron.schedule((0, _config2.default)('MOBILITEIT_REFRESH_CRON', true), function () {
    loadStoppoints();
});

const loadStoppoints = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        stopPoints = yield load();
    });

    return function loadStoppoints() {
        return _ref2.apply(this, arguments);
    };
})();

const load = exports.load = (() => {
    var _ref3 = _asyncToGenerator(function* () {
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
                id: parseInt(params.L, 10),
                name: params.O,
                position: {
                    longitude: parseFloat(params.X.replace(',', '.')),
                    latitude: parseFloat(params.Y.replace(',', '.'))
                }
            });
        }
        return newStopPoints;
    });

    return function load() {
        return _ref3.apply(this, arguments);
    };
})();

const cache = (() => {
    var _ref4 = _asyncToGenerator(function* () {
        if (stopPoints.length === 0) {
            yield loadStoppoints();
        }
    });

    return function cache() {
        return _ref4.apply(this, arguments);
    };
})();

const all = exports.all = (() => {
    var _ref5 = _asyncToGenerator(function* () {
        yield cache();
        return stopPoints;
    });

    return function all() {
        return _ref5.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref6 = _asyncToGenerator(function* (stopPoint) {
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

    return function get(_x) {
        return _ref6.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref7 = _asyncToGenerator(function* (lon, lat, radius) {
        yield cache();
        var dist = 0;
        var stopPointsAround = [];

        for (var i = 0; i < stopPoints.length; i++) {
            dist = (0, _distance2.default)(parseFloat(lon), parseFloat(lat), stopPoints[i].position.longitude, stopPoints[i].position.latitude);

            if (dist <= radius) {
                var temp = _extends({}, stopPoints[i]);
                temp.distance = parseFloat(dist.toFixed(2));
                stopPointsAround.push(temp);
            }
        }
        return stopPointsAround;
    });

    return function around(_x2, _x3, _x4) {
        return _ref7.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref8 = _asyncToGenerator(function* (swlon, swlat, nelon, nelat) {
        yield cache();
        return stopPoints.filter(function (stopPoint) {
            return (0, _inbox2.default)(swlon, swlat, nelon, nelat, stopPoint.position.longitude, stopPoint.position.latitude);
        });
    });

    return function box(_x5, _x6, _x7, _x8) {
        return _ref8.apply(this, arguments);
    };
})();

const search = exports.search = (() => {
    var _ref9 = _asyncToGenerator(function* (searchString) {
        yield cache();

        var results = _fuzzy2.default.filter(searchString, stopPoints, fuzzyOptions);
        return results.map(function (res) {
            return res.original;
        });
    });

    return function search(_x9) {
        return _ref9.apply(this, arguments);
    };
})();