'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.departures = exports.load = undefined;

var _request = require('../../request');

var _request2 = _interopRequireDefault(_request);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = (() => {
    var _ref = _asyncToGenerator(function* () {
        return (yield (0, _request2.default)((0, _config2.default)('MOBILITEIT_STOPPOINTS', true))).data;
    });

    return function getRaw() {
        return _ref.apply(this, arguments);
    };
})();

const load = exports.load = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var raw = yield getRaw();
        var StopPoints = raw.trim().split('\n');
        return StopPoints.map(compileStopPoint);
    });

    return function load() {
        return _ref2.apply(this, arguments);
    };
})();

const compileStopPoint = stopPoint => {
    var paramParts = stopPoint.split('@');
    var params = {};
    for (var j = 0; j < paramParts.length; j++) {
        var keyVal = paramParts[j].split('=', 2);
        params[keyVal[0]] = keyVal[1];
    }
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [parseFloat(params.X.replace(',', '.')), parseFloat(params.Y.replace(',', '.'))]
        },
        properties: {
            id: parseInt(params.L, 10),
            name: params.O
        }
    };
};

const departures = exports.departures = (() => {
    var _ref3 = _asyncToGenerator(function* (stopPoint, maxJourneys) {
        var requestUrl = (0, _config2.default)('MOBILITEIT_DEPARTURE', true);
        requestUrl = requestUrl.replace('{{stopPoint}}', stopPoint);
        requestUrl = requestUrl.replace('{{maxJourneys}}', maxJourneys || 10);
        return (yield (0, _request2.default)(requestUrl)).data;
    });

    return function departures(_x, _x2) {
        return _ref3.apply(this, arguments);
    };
})();