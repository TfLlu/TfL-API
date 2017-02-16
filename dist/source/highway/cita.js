'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileHighwayInfo = exports.get = exports.all = exports.load = undefined;

var _requests = require('../../requests');

var _xmlParser = require('../../helper/xmlParser');

var _xmlParser2 = _interopRequireDefault(_xmlParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const load = exports.load = (() => {
    var _ref = _asyncToGenerator(function* () {
        var raw = yield (0, _requests.cita)();
        var data = yield (0, _xmlParser2.default)(raw);
        return data['kml']['Document']['Folder']['Placemark'];
    });

    return function load() {
        return _ref.apply(this, arguments);
    };
})();

const all = exports.all = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var highwayInfo = yield load();
        var items = highwayInfo.map(compileHighwayInfo);
        return {
            type: 'FeatureCollection',
            features: items
        };
    });

    return function all() {
        return _ref2.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref3 = _asyncToGenerator(function* (carPark) {
        var carParks = yield load();
        carParks = carParks.map(compileHighwayInfo);
        for (var i = 0; i < carParks.length; i++) {
            if (carParks[i].properties.id == carPark) {
                return carParks[i];
            }
        }
    });

    return function get(_x) {
        return _ref3.apply(this, arguments);
    };
})();

const compileHighwayInfo = exports.compileHighwayInfo = highwayInfo => {

    var highway = null;

    switch (highwayInfo.name.toLowerCase()) {
        case 'senningerberg':
        case 'wasserbillig':
            highway = 1;
            break;
        case 'france':
        case 'lux-sud':
            highway = 3;
            break;
        case 'lallange':
        case 'merl':
            highway = 4;
            break;
        case 'belgique':
        case 'bridel':
            highway = 6;
            break;
        case 'schieren':
        case 'mersch':
            highway = 7;
            break;
        case 'schengen':
            highway = 13;
            break;
    }

    var coordinates = /([\d\.]+),([\d\.]+)/g.exec(highwayInfo.Point.coordinates);
    var fluidityRaw = highwayInfo.description.split('</span>');
    var transitTimes = {};
    var fluidity, destination, time;

    for (var i = 0; i < fluidityRaw.length; i++) {
        fluidity = /time'>(.*?)\:\s(.*)/g.exec(fluidityRaw[i]);
        if (fluidity === null) {
            continue;
        }
        destination = fluidity[1];
        time = fluidity[2];
        if (time.indexOf('min') === -1) {
            time = null;
        } else {
            time = /(\d+)min/g.exec(time);
            time = parseInt(time[1]) * 60;
        }
        transitTimes[destination] = time;
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [Math.round(parseFloat(coordinates[1]) * 1000000) / 1000000, Math.round(parseFloat(coordinates[2]) * 1000000) / 1000000]
        },
        properties: {
            id: parseInt(/ID_(\d+)/g.exec(highwayInfo['$'].id)[1]),
            highway: highway,
            transitTimes: transitTimes
        }
    };
};