'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redisPubSub = exports.redis = undefined;

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var redis = new _ioredis2.default();
var redisPubSub = new _ioredis2.default();

exports.redis = redis;
exports.redisPubSub = redisPubSub;