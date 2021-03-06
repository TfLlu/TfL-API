'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.plan = undefined;

var _journey = require('../service/journey');

var journey = _interopRequireWildcard(_journey);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const plan = exports.plan = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
        try {
            ctx.type = 'json';
            ctx.body = yield journey.plan(ctx.params.from, ctx.params.to);
        } catch (boom) {
            ctx.body = boom.output.payload;
            ctx.status = boom.output.statusCode;
        }
    });

    return function plan(_x) {
        return _ref.apply(this, arguments);
    };
})();