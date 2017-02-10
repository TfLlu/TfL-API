'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fireHose = exports.current = exports.load = undefined;

var _meteolux = require('../source/weather/meteolux');

var meteolux = _interopRequireWildcard(_meteolux);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../redis');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CACHE_NAME = (0, _config2.default)('NAME_VERSION', true) + '_cache_weather';
const STREAM_NAME = (0, _config2.default)('NAME_VERSION', true) + '_weather';

const load = exports.load = (() => {
    var _ref = _asyncToGenerator(function* () {
        try {
            return yield meteolux.current();
        } catch (err) {
            throw new _boom2.default.serverUnavailable('The /weather endpoint is temporarily unavailable');
        }
    });

    return function load() {
        return _ref.apply(this, arguments);
    };
})();

const current = exports.current = () => {
    return _redis.redis.get(CACHE_NAME).then(function (result) {
        if (result && result !== '') {
            return JSON.parse(result);
        } else {
            throw new _boom2.default.serverUnavailable('the /Weather endpoint is temporarily unavailable');
        }
    });
};

_redis.redisPubSub.subscribe(STREAM_NAME);
const fireHose = exports.fireHose = callback => {
    const messageCallback = (channel, message) => {
        if (channel === STREAM_NAME) {
            callback(JSON.parse(message));
        }
    };
    current().then(data => {
        callback({
            type: 'new',
            data: data
        });
    });

    _redis.redisPubSub.on('message', messageCallback);

    return {
        off: function () {
            _redis.redisPubSub.removeListener('message', messageCallback);
        }
    };
};