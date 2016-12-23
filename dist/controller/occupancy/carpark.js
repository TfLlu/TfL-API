'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.show = exports.index = undefined;

var _carpark = require('../../service/occupancy/carpark');

var carpark = _interopRequireWildcard(_carpark);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const index = exports.index = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
        ctx.body = yield carpark.items();
    });

    return function index(_x) {
        return _ref.apply(this, arguments);
    };
})();

const show = exports.show = (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
        ctx.body = yield carpark.item(ctx.params.item);
    });

    return function show(_x2) {
        return _ref2.apply(this, arguments);
    };
})();