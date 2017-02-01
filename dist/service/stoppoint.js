'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stream = exports.search = exports.box = exports.around = exports.getByName = exports.get = exports.all = exports.load = undefined;

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

var _deepClone = require('deep-clone');

var _deepClone2 = _interopRequireDefault(_deepClone);

var _redis = require('../redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const STREAM_NAME = (0, _config2.default)('NAME_VERSION', true) + '_stoppoint';

var fuzzyOptions = {
    extract: function (obj) {
        return obj.properties.name;
    }
};

const load = exports.load = (() => {
    var _ref = _asyncToGenerator(function* () {
        return {
            type: 'FeatureCollection',
            features: yield mobiliteit.load()
        };
    });

    return function load() {
        return _ref.apply(this, arguments);
    };
})();

const all = exports.all = () => {
    return _redis.redis.get((0, _config2.default)('NAME_VERSION', true) + '_cache_stoppoint').then(function (result) {
        if (result && result !== '') {
            return JSON.parse(result);
        } else {
            throw new Error('no StopPoints in Redis');
        }
    });
};

const get = exports.get = (() => {
    var _ref2 = _asyncToGenerator(function* (stopPoint) {
        var stopPoints = (yield all()).features;
        for (var i = 0; i < stopPoints.length; i++) {
            if (stopPoints[i].properties.id == stopPoint) {
                return stopPoints[i];
            }
        }
    });

    return function get(_x) {
        return _ref2.apply(this, arguments);
    };
})();

const getByName = exports.getByName = (() => {
    var _ref3 = _asyncToGenerator(function* (name) {
        var stopPoints = (yield all()).features;
        for (var i = 0; i < stopPoints.length; i++) {
            if (stopPoints[i].properties.name == name) {
                return stopPoints[i];
            }
        }
    });

    return function getByName(_x2) {
        return _ref3.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref4 = _asyncToGenerator(function* (lon, lat, radius) {
        var stopPoints = (yield all()).features;
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
        return _ref4.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref5 = _asyncToGenerator(function* (swlon, swlat, nelon, nelat) {
        var stopPoints = (yield all()).features;
        var stopPointsInBox = stopPoints.filter(function (stopPoint) {
            return (0, _inbox2.default)(swlon, swlat, nelon, nelat, stopPoint.geometry.coordinates[0], stopPoint.geometry.coordinates[1]);
        });
        return {
            type: 'FeatureCollection',
            features: stopPointsInBox
        };
    });

    return function box(_x6, _x7, _x8, _x9) {
        return _ref5.apply(this, arguments);
    };
})();

const search = exports.search = (() => {
    var _ref6 = _asyncToGenerator(function* (searchString) {
        var stopPoints = (yield all()).features;
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
        return _ref6.apply(this, arguments);
    };
})();

_redis.redisPubSub.subscribe(STREAM_NAME);
const stream = exports.stream = callback => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            callback(JSON.parse(message));
        }
    };
    all().then(data => {
        callback({
            type: 'new',
            data: data.features.map(compileStream)
        });
    });

    _redis.redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            _redis.redisPubSub.removeListener('message', messageCallback);
        }
    };
};

const compileStream = bikePoint => {
    return {
        id: bikePoint.properties.id,
        data: bikePoint
    };
};