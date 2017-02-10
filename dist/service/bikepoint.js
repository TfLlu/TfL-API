'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStream = exports.streamSingle = exports.fireHose = exports.search = exports.box = exports.around = exports.get = exports.load = exports.all = exports.compileBikePoint = undefined;

var _velok = require('../source/bikepoint/velok');

var velok = _interopRequireWildcard(_velok);

var _veloh = require('../source/bikepoint/veloh');

var veloh = _interopRequireWildcard(_veloh);

var _fuzzy = require('fuzzy');

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _distance = require('../helper/distance');

var _distance2 = _interopRequireDefault(_distance);

var _inbox = require('../helper/inbox');

var _inbox2 = _interopRequireDefault(_inbox);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../redis');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CACHE_NAME = (0, _config2.default)('NAME_VERSION', true) + '_cache_bikepoint';
const STREAM_NAME = (0, _config2.default)('NAME_VERSION', true) + '_bikepoint';

var fuzzyOptions = {
    extract: function (obj) {
        return obj.properties.name + obj.properties.address + obj.properties.city;
    }
};

const compileBikePoint = exports.compileBikePoint = function (provider, bikePoint) {
    bikePoint.properties.id = provider + ':' + bikePoint.properties.id;
    return bikePoint;
};

const all = exports.all = () => {
    return _redis.redis.get(CACHE_NAME).then(function (result) {
        if (result && result !== '') {
            return JSON.parse(result);
        } else {
            throw new _boom2.default.serverUnavailable('all /BikePoints endpoints are temporarily unavailable');
        }
    });
};

const load = exports.load = () => {
    const sources = {
        'velok': velok.all(),
        'veloh': veloh.all()
    };

    var providers = Object.keys(sources);

    return Promise.all(
    //TODO: replace when Issue #2 is closed
    Object.keys(sources).map(key => sources[key])).then(results => {

        var bikePoints = [];

        for (let i = 0; i < results.length; i++) {
            bikePoints = [...bikePoints, ...results[i].map(bikePoint => compileBikePoint(providers[i], bikePoint))];
        }

        return {
            type: 'FeatureCollection',
            features: bikePoints
        };
    }, err => {
        console.error(err);
        throw new _boom2.default.serverUnavailable('all /BikePoints endpoints are temporarily unavailable');
    });
};

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (bikePoint) {
        var bikePoints = (yield all()).features;
        for (var i = 0; i < bikePoints.length; i++) {
            if (bikePoints[i].properties.id == bikePoint) {
                return bikePoints[i];
            }
        }
        throw new _boom2.default.notFound('Bike point [' + bikePoint + '] not found');
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref2 = _asyncToGenerator(function* (lon, lat, radius) {
        var bikePoints = (yield all()).features;
        var dist = 0;
        var bikePointsAround = [];

        for (var i = 0; i < bikePoints.length; i++) {
            var bikePoint = bikePoints[i];
            dist = (0, _distance2.default)(parseFloat(lon), parseFloat(lat), bikePoint.geometry.coordinates[0], bikePoint.geometry.coordinates[1]);

            if (dist <= radius) {
                bikePoint.properties.distance = parseFloat(dist.toFixed(2));
                bikePointsAround.push(bikePoint);
            }
        }
        return {
            type: 'FeatureCollection',
            features: bikePointsAround
        };
    });

    return function around(_x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref3 = _asyncToGenerator(function* (swlon, swlat, nelon, nelat) {
        var bikePoints = (yield all()).features;
        var bikePointsInBox = bikePoints.filter(function (bikePoint) {
            return (0, _inbox2.default)(swlon, swlat, nelon, nelat, bikePoint.geometry.coordinates[0], bikePoint.geometry.coordinates[1]);
        });
        return {
            type: 'FeatureCollection',
            features: bikePointsInBox
        };
    });

    return function box(_x5, _x6, _x7, _x8) {
        return _ref3.apply(this, arguments);
    };
})();

const search = exports.search = (() => {
    var _ref4 = _asyncToGenerator(function* (searchString) {
        var bikePoints = (yield all()).features;
        var results = _fuzzy2.default.filter(searchString, bikePoints, fuzzyOptions);
        results = results.map(function (res) {
            return res.original;
        });
        return {
            type: 'FeatureCollection',
            features: results
        };
    });

    return function search(_x9) {
        return _ref4.apply(this, arguments);
    };
})();

_redis.redisPubSub.subscribe(STREAM_NAME);
const fireHose = exports.fireHose = callback => {
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

const streamSingle = exports.streamSingle = (bikePoint, callback) => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            message = JSON.parse(message);
            for (var i = 0; i < message.data.length; i++) {
                if (message.data[i].id == bikePoint) {
                    callback({
                        type: 'update',
                        data: [compileStream(message.data[i].data)]
                    });
                }
            }
        }
    };
    all().then(data => {
        for (var key in data.features) {
            if (data.features[key].properties.id == bikePoint) {
                callback({
                    type: 'new',
                    data: [compileStream(data.features[key])]
                });
            }
        }
    });
    _redis.redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            _redis.redisPubSub.removeListener('message', messageCallback);
        }
    };
};

const compileStream = exports.compileStream = bikePoint => {
    return {
        id: bikePoint.properties.id,
        data: bikePoint
    };
};