'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileBikePoint = exports.get = exports.all = exports.loadBikePoints = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = (() => {
    var _ref = _asyncToGenerator(function* (bikePoint) {
        if (typeof bikePoint === 'undefined') return (yield (0, _axios2.default)('https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=' + (0, _config2.default)('API_KEY_JCD', true))).data;
        return (yield (0, _axios2.default)('https://api.jcdecaux.com/vls/v1/stations/' + bikePoint + '?contract=Luxembourg&apiKey=' + (0, _config2.default)('API_KEY_JCD', true))).data;
    });

    return function getRaw(_x) {
        return _ref.apply(this, arguments);
    };
})();

const loadBikePoints = exports.loadBikePoints = (() => {
    var _ref2 = _asyncToGenerator(function* (bikePoint) {
        return yield getRaw(bikePoint);
    });

    return function loadBikePoints(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

const all = exports.all = (() => {
    var _ref3 = _asyncToGenerator(function* () {
        var bikePoints = yield loadBikePoints();
        return bikePoints.map(compileBikePoint);
    });

    return function all() {
        return _ref3.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref4 = _asyncToGenerator(function* (bikePointId) {
        var bikePoint = yield loadBikePoints(bikePointId);
        return compileBikePoint(bikePoint);
    });

    return function get(_x3) {
        return _ref4.apply(this, arguments);
    };
})();

const compileBikePoint = exports.compileBikePoint = bikePoint => {

    var dock_status = [];

    for (var i = 1; i <= bikePoint.available_bikes; i++) {
        dock_status.push({
            status: 'occupied',
            bikeType: 'manual'
        });
    }

    for (i = 1; i <= bikePoint.available_bike_stands; i++) {
        dock_status.push({
            status: 'free',
            bikeType: null
        });
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [parseFloat(bikePoint.position.lng), parseFloat(bikePoint.position.lat)]
        },
        properties: {
            id: bikePoint.number,
            open: bikePoint.status == 'OPEN',
            name: bikePoint.name,
            city: null,
            address: bikePoint.address,
            photo: null,
            docks: parseInt(bikePoint.bike_stands),
            available_bikes: parseInt(bikePoint.available_bikes),
            available_ebikes: 0,
            available_docks: parseInt(bikePoint.available_bike_stands),
            last_update: bikePoint.last_update,
            dock_status: dock_status
        }
    };
};