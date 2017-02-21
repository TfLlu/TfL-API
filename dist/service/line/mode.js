'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRoutes = exports.get = undefined;

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../../redis');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CACHE_NAME = (0, _config2.default)('NAME_VERSION', true) + '_cache_line_mode_';
const CACHE_MODE_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_line_route_mode_';
const UNAVAILABLE_ERROR = new _boom2.default.serverUnavailable('all /Line/Mode endpoints are temporarily unavailable');

const get = exports.get = mode => {
    return _redis.redis.get(CACHE_NAME + mode).then(function (result) {
        if (result && result !== '') {
            return result;
        } else {
            throw UNAVAILABLE_ERROR;
        }
    }).catch(() => {
        throw new _boom2.default.notFound('Mode [' + mode + '] not found');
    });
};

const getRoutes = exports.getRoutes = mode => {
    return _redis.redis.get(CACHE_MODE_TABLE + mode).then(function (result) {
        if (result && result !== '') {
            return result;
        } else {
            throw UNAVAILABLE_ERROR;
        }
    }).catch(() => {
        throw new _boom2.default.notFound('Mode [' + mode + '] not found');
    });
};