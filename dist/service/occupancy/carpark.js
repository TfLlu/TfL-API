'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileCarPark = exports.compileStream = exports.streamSingle = exports.fireHose = exports.get = exports.load = exports.all = undefined;

var _vdl = require('../../source/occupancy/carpark/vdl');

var vdl = _interopRequireWildcard(_vdl);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../../redis');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CACHE_NAME = (0, _config2.default)('NAME_VERSION', true) + '_cache_occupancy_carpark';
const STREAM_NAME = (0, _config2.default)('NAME_VERSION', true) + '_occupancy_carpark';

const all = exports.all = () => {
    return _redis.redis.get(CACHE_NAME).then(function (result) {
        if (result && result !== '') {
            return JSON.parse(result);
        } else {
            throw new _boom2.default.serverUnavailable('all /Occupancy/CarPark endpoints are temporarily unavailable');
        }
    });
};

const load = exports.load = () => {
    const sources = {
        'vdl': vdl.all()
    };
    var providers = Object.keys(sources);
    return Promise.all(
    //TODO: replace when Issue #2 is closed
    Object.keys(sources).map(key => sources[key])).then(results => {
        var items = [];
        for (let i = 0; i < results.length; i++) {
            items = [...items, ...results[i].map(item => compileCarPark(providers[i], item))];
        }
        return {
            type: 'FeatureCollection',
            features: items
        };
    }, () => {
        throw new _boom2.default.serverUnavailable('all /Occupancy/Carpark endpoints are temporarily unavailable');
    });
};

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (carPark) {
        try {
            var carParkSplit = carPark.split(':');
            var provider = carParkSplit[0];
            switch (provider) {
                case 'vdl':
                    carPark = yield vdl.get(carParkSplit[1]);
                    break;
                default:
                    throw new Error('not found');
            }
            return compileCarPark(provider, carPark);
        } catch (err) {
            throw new _boom2.default.notFound('Carpark [' + carPark + '] not found or unavailable');
        }
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
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

const streamSingle = exports.streamSingle = (carPark, callback) => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            message = JSON.parse(message);
            for (var i = 0; i < message.data.length; i++) {
                if (message.data[i].id == carPark) {
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
            if (data.features[key].properties.id == carPark) {
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

const compileStream = exports.compileStream = carpark => {
    return {
        id: carpark.properties.id,
        data: carpark
    };
};

const compileCarPark = exports.compileCarPark = function (provider, item) {
    item.properties.id = provider + ':' + item.properties.id;
    return item;
};