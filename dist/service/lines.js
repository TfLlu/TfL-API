'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStream = exports.streamSingle = exports.fireHose = exports.get = exports.all = exports.load = undefined;

var _transitfeeds = require('../source/lines/transitfeeds');

var transitfeeds = _interopRequireWildcard(_transitfeeds);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../redis');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CACHE_NAME = (0, _config2.default)('NAME_VERSION', true) + '_cache_lines';
const STREAM_NAME = (0, _config2.default)('NAME_VERSION', true) + '_lines';
const UNAVAILABLE_ERROR = new _boom2.default.serverUnavailable('all /Lines endpoints are temporarily unavailable');

const load = exports.load = (() => {
    var _ref = _asyncToGenerator(function* () {
        try {
            return yield transitfeeds.load();
        } catch (err) {
            throw new _boom2.default.serverUnavailable('the /Highway endpoint is temporarily unavailable' + err);
        }
    });

    return function load() {
        return _ref.apply(this, arguments);
    };
})();

const all = exports.all = () => {
    return _redis.redis.get(CACHE_NAME).then(function (result) {
        if (result && result !== '') {
            return result;
        } else {
            throw UNAVAILABLE_ERROR;
        }
    }).catch(() => {
        throw UNAVAILABLE_ERROR;
    });
};

const get = exports.get = (() => {
    var _ref2 = _asyncToGenerator(function* (highway) {
        var highways = JSON.parse((yield all()));
        for (var i = 0; i < highways.length; i++) {
            if (highways[i].id == highway) {
                return highways[i];
            }
        }
        throw new _boom2.default.notFound('Highway [' + highway + '] not found');
    });

    return function get(_x) {
        return _ref2.apply(this, arguments);
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
        data = JSON.parse(data);
        callback({
            type: 'new',
            data: data.map(compileStream)
        });
    });

    _redis.redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            _redis.redisPubSub.removeListener('message', messageCallback);
        }
    };
};

const streamSingle = exports.streamSingle = (highway, callback) => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            message = JSON.parse(message);
            for (var i = 0; i < message.data.length; i++) {
                if (message.data[i].id == highway) {
                    callback({
                        type: 'update',
                        data: [compileStream(message.data[i].data)]
                    });
                }
            }
        }
    };
    all().then(data => {
        data = JSON.parse(data);
        for (var key in data) {
            if (data[key].id == highway) {
                callback({
                    type: 'new',
                    data: [compileStream(data[key])]
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

const compileStream = exports.compileStream = highway => {
    return {
        id: highway.id,
        data: highway
    };
};