'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.streamIndex = exports.get = undefined;

var _departures = require('../../service/stoppoint/departures');

var departures = _interopRequireWildcard(_departures);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
        ctx.body = yield departures.get(parseInt(ctx.params.stopPoint), parseInt(ctx.params.limit));
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
    };
})();

const streamIndex = exports.streamIndex = (() => {
    var _ref2 = _asyncToGenerator(function* ({ emit, disconnect }) {
        var res = departures.stream(function (data) {
            emit(data);
        });

        disconnect(function () {
            res.off();
        });
    });

    return function streamIndex(_x2) {
        return _ref2.apply(this, arguments);
    };
})();