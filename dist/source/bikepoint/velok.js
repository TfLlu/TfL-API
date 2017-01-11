'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileBikePoint = exports.get = exports.all = exports.loadBikePoints = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _xmlParser = require('../../helper/xmlParser');

var _xmlParser2 = _interopRequireDefault(_xmlParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = () => (0, _requestPromiseNative2.default)('https://webservice.velok.lu/stationattache.aspx');

const loadBikePoints = exports.loadBikePoints = (() => {
    var _ref = _asyncToGenerator(function* () {
        var raw = yield getRaw();
        var data = yield (0, _xmlParser2.default)(raw);
        return data['velok']['station'];
    });

    return function loadBikePoints() {
        return _ref.apply(this, arguments);
    };
})();

const all = exports.all = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var bikePoints = yield loadBikePoints();
        return bikePoints.map(compileBikePoint);
    });

    return function all() {
        return _ref2.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref3 = _asyncToGenerator(function* (bikePoint) {
        var bikePoints = yield loadBikePoints();
        bikePoints = bikePoints.map(compileBikePoint);
        for (var i = 0; i < bikePoints.length; i++) {
            if (bikePoints[i].properties.id == bikePoint) {
                return bikePoints[i];
            }
        }
    });

    return function get(_x) {
        return _ref3.apply(this, arguments);
    };
})();

const compileBikePoint = exports.compileBikePoint = bikePoint => {
    var dock_status = [];
    var attache, status, bikeType;
    for (var i = 1; i <= bikePoint.attaches; i++) {
        attache = parseInt(bikePoint['attache' + i]);
        switch (attache) {
            case 0:
                status = 'free';
                bikeType = null;
                break;

            case 1:
                status = 'occupied';
                bikeType = 'manual';
                break;

            case 2:
                status = 'occupied';
                bikeType = 'electric';
                break;
        }
        dock_status.push({
            status: status,
            bikeType: bikeType
        });
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [parseFloat(bikePoint.longitude), parseFloat(bikePoint.latitude)]
        },
        properties: {
            id: parseInt(bikePoint.nstation),
            open: bikePoint.active == 1,
            name: bikePoint.nom,
            city: bikePoint.nomlocalite,
            address: bikePoint.lieu,
            photo: bikePoint.urlphoto,
            docks: parseInt(bikePoint.attaches),
            available_bikes: parseInt(bikePoint.bikes),
            available_ebikes: parseInt(bikePoint.ebikes),
            available_docks: parseInt(bikePoint.libres),
            last_update: null,
            dock_status: dock_status
        }
    };
};