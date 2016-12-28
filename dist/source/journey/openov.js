'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.plan = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const plan = exports.plan = (from, to) => {
    return (0, _requestPromiseNative2.default)('https://planner.tfl.lu/rrrr/plan?from-latlng=' + from + '&to-latlng=' + to);
};