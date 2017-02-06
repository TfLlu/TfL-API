'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.current = undefined;

var _meteolux = require('../source/weather/meteolux');

var meteolux = _interopRequireWildcard(_meteolux);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const current = exports.current = (() => {
    var _ref = _asyncToGenerator(function* () {
        try {
            return yield meteolux.current();
        } catch (err) {
            throw new _boom2.default.serverUnavailable('The /weather endpoint is temporarily unavailable');
        }
    });

    return function current() {
        return _ref.apply(this, arguments);
    };
})();