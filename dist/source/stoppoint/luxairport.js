'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.departures = undefined;

var _requests = require('../../requests');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const departures = exports.departures = (() => {
    var _ref = _asyncToGenerator(function* () {
        var raw = yield (0, _requests.luxairportDepartures)();
        return raw;
    });

    return function departures() {
        return _ref.apply(this, arguments);
    };
})();