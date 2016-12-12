'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStation = exports.stations = exports.get = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = () => (0, _requestPromiseNative2.default)('https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=1835af14f29db63b765a3335ba42891323ce8f12');

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* () {
        var raw = yield getRaw();
        return JSON.parse(raw);
    });

    return function get() {
        return _ref.apply(this, arguments);
    };
})();

const stations = exports.stations = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var stations = yield get();
        return stations.map(compileStation);
    });

    return function stations() {
        return _ref2.apply(this, arguments);
    };
})();

const compileStation = exports.compileStation = station => {

    var dock_status = [];

    for (var i = 1; i <= station.available_bikes; i++) {
        dock_status.push({
            status: 'occupied',
            bikeType: 'manual'
        });
    }

    for (i = 1; i <= station.available_bike_stands; i++) {
        dock_status.push({
            status: 'free',
            bikeType: null
        });
    }

    return {
        id: station.number,
        open: station.status == 'OPEN',
        name: station.name,
        position: {
            longitude: parseFloat(station.position.lat),
            latitude: parseFloat(station.position.lng)
        },
        city: null,
        address: station.address,
        photo: null,
        docks: parseInt(station.bike_stands),
        available_bikes: parseInt(station.available_bikes),
        available_ebikes: null,
        available_docks: parseInt(station.available_bike_stands),
        last_update: station.last_update,
        dock_status: dock_status
    };
};