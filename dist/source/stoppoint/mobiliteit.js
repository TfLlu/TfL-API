'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = exports.box = exports.around = exports.get = exports.all = exports.load = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

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

const getRaw = () => {
    return (0, _requestPromiseNative2.default)((0, _config2.default)('MOBILITEIT_STOPPOINTS', true));
};

cron.schedule((0, _config2.default)('MOBILITEIT_REFRESH_CRON', true), function () {
    loadStoppoints();
});

const loadStoppoints = (() => {
    var _ref = _asyncToGenerator(function* () {
        stopPoints = yield load();
    });

    return function loadStoppoints() {
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
                id: parseInt(params.L, 10),
                name: params.O,
                longitude: parseFloat(params.X.replace(',', '.')),
                latitude: parseFloat(params.Y.replace(',', '.'))
            });
        }
        return newStopPoints;
    });

    return function load() {
        return _ref2.apply(this, arguments);
    };
})();

const cache = (() => {
    var _ref3 = _asyncToGenerator(function* () {
        if (stopPoints.length === 0) {
            yield loadStoppoints();
        }
    });

    return function cache() {
        return _ref3.apply(this, arguments);
    };
})();

const all = exports.all = (() => {
    var _ref4 = _asyncToGenerator(function* () {
        yield cache();
        return stopPoints;
    });

    return function all() {
        return _ref4.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref5 = _asyncToGenerator(function* (stopPoint) {
        yield cache();
        for (var i = 0; i < stopPoints.length; i++) {
            if (stopPoints[i].id == stopPoint) {
                return stopPoints[i];
            }
        }
        return false;
    });

    return function get(_x) {
        return _ref5.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref6 = _asyncToGenerator(function* (lon, lat, radius) {
        yield cache();
        var dist = 0;
        var stopPointsAround = [];

        for (var i = 0; i < stopPoints.length; i++) {
            dist = (0, _distance2.default)(parseFloat(lon), parseFloat(lat), stopPoints[i].longitude, stopPoints[i].latitude);

            if (dist <= radius) {
                var temp = stopPoints[i];
                temp.distance = parseFloat(dist.toFixed(2));
                stopPointsAround.push(temp);
            }
        }
        return stopPointsAround;
    });

    return function around(_x2, _x3, _x4) {
        return _ref6.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref7 = _asyncToGenerator(function* (swlon, swlat, nelon, nelat) {
        yield cache();
        return stopPoints.filter(function (stopPoint) {
            return (0, _inbox2.default)(swlon, swlat, nelon, nelat, stopPoint.longitude, stopPoint.latitude);
        });
    });

    return function box(_x5, _x6, _x7, _x8) {
        return _ref7.apply(this, arguments);
    };
})();

const search = exports.search = (() => {
    var _ref8 = _asyncToGenerator(function* (searchString) {
        yield cache();
        return stopPoints.filter(function (stopPoint) {
            return stopPoint.name.toLowerCase().indexOf(searchString) >= 0;
        });
    });

    return function search(_x9) {
        return _ref8.apply(this, arguments);
    };
})();