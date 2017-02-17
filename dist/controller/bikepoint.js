'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = exports.box = exports.around = exports.get = exports.streamSingle = exports.fireHose = exports.index = undefined;

var _bikepoint = require('../service/bikepoint');

var bikepoint = _interopRequireWildcard(_bikepoint);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const STREAM_CLIENTS_KEY = (0, _config2.default)('NAME_VERSION', true) + '_stream_clients_bikepoint';

const index = exports.index = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield bikepoint.all();
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function index(_x) {
        return _ref.apply(this, arguments);
    };
})();

const fireHose = exports.fireHose = (() => {
    var _ref2 = _asyncToGenerator(function* ({ emit, disconnect }) {
        _redis.redis.incr(STREAM_CLIENTS_KEY);
        var res = bikepoint.fireHose(function (data) {
            emit(data);
        });

        disconnect(function () {
            _redis.redis.decr(STREAM_CLIENTS_KEY);
            res.off();
        });
    });

    return function fireHose(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

const streamSingle = exports.streamSingle = (() => {
    var _ref3 = _asyncToGenerator(function* ({ emit, disconnect, params }) {
        _redis.redis.incr(STREAM_CLIENTS_KEY);
        var res = bikepoint.streamSingle(params.bikePoint, function (data) {
            emit(data);
        });

        disconnect(function () {
            _redis.redis.decr(STREAM_CLIENTS_KEY);
            res.off();
        });
    });

    return function streamSingle(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref4 = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield bikepoint.get(ctx.params.bikePoint);
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function get(_x4) {
        return _ref4.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref5 = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield bikepoint.around(parseFloat(ctx.params.lon), parseFloat(ctx.params.lat), ctx.params.radius);
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function around(_x5) {
        return _ref5.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref6 = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield bikepoint.box(parseFloat(ctx.params.swlon), parseFloat(ctx.params.swlat), parseFloat(ctx.params.nelon), parseFloat(ctx.params.nelat));
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function box(_x6) {
        return _ref6.apply(this, arguments);
    };
})();

const search = exports.search = (() => {
    var _ref7 = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield bikepoint.search(ctx.params.searchstring.toLowerCase());
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function search(_x7) {
        return _ref7.apply(this, arguments);
    };
})();