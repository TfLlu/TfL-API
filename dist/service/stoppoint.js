'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compilePoint = exports.point = exports.points = undefined;

var _mobiliteit = require('../source/stoppoint/mobiliteit');

var mobiliteit = _interopRequireWildcard(_mobiliteit);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const points = exports.points = (() => {
    var _ref = _asyncToGenerator(function* () {
        const points = yield mobiliteit.points();
        return points;
    });

    return function points() {
        return _ref.apply(this, arguments);
    };
})();

const point = exports.point = (() => {
    var _ref2 = _asyncToGenerator(function* (_point) {
        _point = _point.split(':');
        return yield mobiliteit.station(_point[1]);
    });

    return function point(_x) {
        return _ref2.apply(this, arguments);
    };
})();

const compilePoint = exports.compilePoint = function (provider, point) {
    point.id = provider + ':' + point.id;
    return point;
};