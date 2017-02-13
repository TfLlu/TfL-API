'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

exports.default = (key, required) => {
    if (key in process.env) {
        return process.env[key];
    }
    if (required) {
        throw `Missing "${key}" config`;
    }
    return null;
};