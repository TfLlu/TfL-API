'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStation = exports.station = exports.points = exports.get = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = () => {
    return (0, _requestPromiseNative2.default)('http://travelplanner.mobiliteit.lu/hafas/query.exe/dot?performLocating=2&tpl=stop2csv&look_maxdist=150000&look_x=6112550&look_y=49610700&stationProxy=yes');
};

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (bikePoint) {

        var raw = yield getRaw(bikePoint);
        var stations = raw.trim().split('\n');
        var result = [];

        for (var i = 0; i < stations.length; i++) {
            var paramParts = stations[i].split('@');
            var params = {};
            for (var j = 0; j < paramParts.length; j++) {
                var keyVal = paramParts[j].split('=', 2);
                params[keyVal[0]] = keyVal[1];
            }
            result.push({
                id: parseInt(params.L, 10),
                name: params.O,
                longitude: parseFloat(params.X.replace(',', '.')),
                latitude: parseFloat(params.Y.replace(',', '.'))
            });
        }

        return result;
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
    };
})();

const points = exports.points = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var stations = yield get();
        return stations.map(compileStation);
    });

    return function points() {
        return _ref2.apply(this, arguments);
    };
})();

const station = exports.station = (() => {
    var _ref3 = _asyncToGenerator(function* (bikePoint) {
        var station = yield get(bikePoint);
        return compileStation(station);
    });

    return function station(_x2) {
        return _ref3.apply(this, arguments);
    };
})();

const compileStation = exports.compileStation = station => {
    return station;
};