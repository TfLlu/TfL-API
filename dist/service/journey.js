'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.plan = undefined;

var _openov = require('../source/journey/openov');

var openOV = _interopRequireWildcard(_openov);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const plan = exports.plan = (() => {
    var _ref = _asyncToGenerator(function* (from, to) {
        return yield openOV.plan(from, to);
    });

    return function plan(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();