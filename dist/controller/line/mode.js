'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRoutes = exports.get = undefined;

var _mode = require('../../service/line/mode');

var mode = _interopRequireWildcard(_mode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield mode.get(ctx.params.mode);
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
    };
})();

const getRoutes = exports.getRoutes = (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
        try {
            ctx.body = yield mode.getRoutes(ctx.params.mode);
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function getRoutes(_x2) {
        return _ref2.apply(this, arguments);
    };
})();