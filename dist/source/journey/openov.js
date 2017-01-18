'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.plan = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const plan = exports.plan = (() => {
    var _ref = _asyncToGenerator(function* (from, to) {
        return (yield (0, _axios2.default)('https://planner.tfl.lu/rrrr/plan?from-latlng=' + from + '&to-latlng=' + to)).data;
    });

    return function plan(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();