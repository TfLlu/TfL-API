'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fireHose = exports.current2 = exports.current = undefined;

var _aev = require('../../source/weather/aev');

var meteolux = _interopRequireWildcard(_aev);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../../redis');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CACHE_NAME = (0, _config2.default)('NAME_VERSION', true) + '_cache_airquality';
const STREAM_NAME = (0, _config2.default)('NAME_VERSION', true) + '_airquality';
const UNAVAILABLE_ERROR = new _boom2.default.serverUnavailable('all /Weather/Airquality endpoints are temporarily unavailable');

const current = exports.current = (() => {
    var _ref = _asyncToGenerator(function* () {
        try {
            return yield meteolux.current();
        } catch (err) {
            throw UNAVAILABLE_ERROR;
        }
    });

    return function current() {
        return _ref.apply(this, arguments);
    };
})();

const current2 = exports.current2 = () => {
    return _redis.redis.get(CACHE_NAME).then(function (result) {
        if (result && result !== '') {
            return result;
        } else {
            throw UNAVAILABLE_ERROR;
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
        data = JSON.parse(data);
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