'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = exports.box = exports.around = exports.departures = exports.get = exports.all = undefined;

var _mobiliteit = require('../source/stoppoint/mobiliteit');

var mobiliteit = _interopRequireWildcard(_mobiliteit);

var _fuzzy = require('fuzzy');

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _distance = require('../helper/distance');

var _distance2 = _interopRequireDefault(_distance);

var _inbox = require('../helper/inbox');

var _inbox2 = _interopRequireDefault(_inbox);

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _deepClone = require('deep-clone');

var _deepClone2 = _interopRequireDefault(_deepClone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fuzzyOptions = {
    extract: function (obj) {
        return obj.properties.name;
    }
};

var stopPoints = [];

_nodeCron2.default.schedule((0, _config2.default)('MOBILITEIT_REFRESH_CRON', true), function () {
    loadStoppoints();
});

const loadStoppoints = (() => {
    var _ref = _asyncToGenerator(function* () {
        stopPoints = yield mobiliteit.load();
    });

    return function loadStoppoints() {
        return _ref.apply(this, arguments);
    };
})();

const cache = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        if (stopPoints.length === 0) {
            yield loadStoppoints();
        }
    });

    return function cache() {
        return _ref2.apply(this, arguments);
    };
})();

const all = exports.all = (() => {
    var _ref3 = _asyncToGenerator(function* () {
        yield cache();
        return {
            type: 'FeatureCollection',
            features: stopPoints
        };
    });

    return function all() {
        return _ref3.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref4 = _asyncToGenerator(function* (stopPoint) {
        yield cache();
        for (var i = 0; i < stopPoints.length; i++) {
            if (stopPoints[i].properties.id == stopPoint) {
                return stopPoints[i];
            }
        }
    });

    return function get(_x) {
        return _ref4.apply(this, arguments);
    };
})();

const departures = exports.departures = (() => {
    var _ref5 = _asyncToGenerator(function* (stopPoint) {
        var departuresRaw = yield mobiliteit.departures(stopPoint);
        var departures = [];
        var rawDepartures = JSON.parse(departuresRaw).Departure;
        if (rawDepartures) {
            for (var i = 0; i < rawDepartures.length; i++) {
                var departure = {};
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

    return function departures(_x2) {
        return _ref5.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref6 = _asyncToGenerator(function* (lon, lat, radius) {
        yield cache();
        var dist = 0;
        var stopPointsAround = [];

        for (var i = 0; i < stopPoints.length; i++) {
            dist = (0, _distance2.default)(parseFloat(lon), parseFloat(lat), stopPoints[i].geometry.coordinates[0], stopPoints[i].geometry.coordinates[1]);

            if (dist <= radius) {
                var tmpStopPoint = (0, _deepClone2.default)(stopPoints[i]);
                tmpStopPoint.properties.distance = parseFloat(dist.toFixed(2));
                stopPointsAround.push(tmpStopPoint);
            }
        }
        return {
            type: 'FeatureCollection',
            features: stopPointsAround
        };
    });

    return function around(_x3, _x4, _x5) {
        return _ref6.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref7 = _asyncToGenerator(function* (swlon, swlat, nelon, nelat) {
        yield cache();
        var stopPointsInBox = stopPoints.filter(function (stopPoint) {
            return (0, _inbox2.default)(swlon, swlat, nelon, nelat, stopPoint.geometry.coordinates[0], stopPoint.geometry.coordinates[1]);
        });
        return {
            type: 'FeatureCollection',
            features: stopPointsInBox
        };
    });

    return function box(_x6, _x7, _x8, _x9) {
        return _ref7.apply(this, arguments);
    };
})();

const search = exports.search = (() => {
    var _ref8 = _asyncToGenerator(function* (searchString) {
        yield cache();

        var results = _fuzzy2.default.filter(searchString, stopPoints, fuzzyOptions);
        var stopPointMatches = results.map(function (res) {
            return res.original;
        });

        return {
            type: 'FeatureCollection',
            features: stopPointMatches
        };
    });

    return function search(_x10) {
        return _ref8.apply(this, arguments);
    };
})();