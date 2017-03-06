'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.streamSingle = exports.current = undefined;

var _weather = require('../service/weather');

var weather = _interopRequireWildcard(_weather);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const STREAM_CLIENTS_KEY = (0, _config2.default)('NAME_VERSION', true) + '_stream_clients_weather';

const current = exports.current = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield weather.current();
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function current(_x) {
        return _ref.apply(this, arguments);
    };
})();

const streamSingle = exports.streamSingle = (() => {
    var _ref2 = _asyncToGenerator(function* ({ emit, disconnect }) {
        console.log('hellow');
        _redis.redis.incr(STREAM_CLIENTS_KEY);
        var res = weather.fireHose(function (data) {
            emit(data);
        });

        disconnect(function () {
            _redis.redis.decr(STREAM_CLIENTS_KEY);
            res.off();
        });
    });

    return function streamSingle(_x2) {
        return _ref2.apply(this, arguments);
    };
})();