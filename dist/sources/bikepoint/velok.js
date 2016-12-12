'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStation = exports.stations = exports.get = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _xmlParser = require('../../helpers/xmlParser');

var _xmlParser2 = _interopRequireDefault(_xmlParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = () => (0, _requestPromiseNative2.default)('https://webservice.velok.lu/stationattache.aspx');

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* () {
        var raw = yield getRaw();
        var data = yield (0, _xmlParser2.default)(raw);

        return data['velok']['station'];
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

const compileStation = exports.compileStation = item => {

    var dock_status = [];
    var attache, status, bikeType;

    for (var i = 1; i <= item.attaches; i++) {

        attache = parseInt(item['attache' + i]);

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
        id: parseInt(item.nstation),
        open: item.active == 1,
        name: item.nom,
        position: {
            longitude: parseFloat(item.latitude),
            latitude: parseFloat(item.longitude)
        },
        city: item.nomlocalite,
        address: item.lieu,
        photo: item.urlphoto,
        docks: parseInt(item.attaches),
        available_bikes: parseInt(item.bikes),
        available_ebikes: parseInt(item.ebikes),
        available_docks: parseInt(item.libres),
        last_update: null,
        dock_status: dock_status

    };
};