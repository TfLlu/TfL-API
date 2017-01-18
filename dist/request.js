'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _monitor = require('./monitor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const request = _axios2.default.create({
    responseType: 'text'
});

request.interceptors.request.use(config => {
    config.startTime = Date.now();
    return config;
});

request.interceptors.response.use(response => {
    response.config.endTime = Date.now();
    (0, _monitor.requestTime)(response);
    return response;
});

exports.default = request;