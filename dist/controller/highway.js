'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = exports.index = undefined;

var _highway = require('../service/highway');

var highway = _interopRequireWildcard(_highway);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/*import config          from '../config';
import {redis}         from '../redis';

const STREAM_CLIENTS_KEY = config('NAME_VERSION', true) + '_stream_clients_weather_airquality';*/

const index = exports.index = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
        try {
            //ctx.body = await highway.all();
            ctx.body = yield highway.load();
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function index(_x) {
        return _ref.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield highway.get(ctx.params.weatherStation);
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function get(_x2) {
        return _ref2.apply(this, arguments);
    };
})();
/*
export const fireHose = async ({ emit, disconnect }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = airquality.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};

export const streamSingle = async ({ emit, disconnect, params }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = airquality.streamSingle(params.weatherStation, data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};*/