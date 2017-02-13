'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileWeatherStation = exports.load = exports.get = exports.current = undefined;

var _requests = require('../../requests');

var _luref = require('../../helper/luref');

var _luref2 = _interopRequireDefault(_luref);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const current = exports.current = (() => {
    var _ref = _asyncToGenerator(function* () {
        return yield load();
    });

    return function current() {
        return _ref.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref2 = _asyncToGenerator(function* (measurment) {
        var raw = yield (0, _requests.aev)(measurment);
        var rawData = /<DATA_RESULT>([^<]*)<\/DATA_RESULT>/g.exec(raw)[1].split('|');
        var data = [];
        for (var i = 0; i < rawData.length; i++) {
            if (rawData[i].indexOf(';') !== -1) {
                data.push(rawData[i]);
            }
        }
        return data;
    });

    return function get(_x) {
        return _ref2.apply(this, arguments);
    };
})();

const load = exports.load = (() => {
    var _ref3 = _asyncToGenerator(function* () {
        const data = {
            'temp': get('TE-degreC'),
            'pm10': get('PM10-microg/m3'),
            'no2': get('NO2-microg/m3'),
            'o3': get('O3-microg/m3'),
            'so2': get('SO2-microg/m3'),
            'co': get('CO-mg/m3')
        };

        var sources = Object.keys(data);

        return Promise.all(
        //TODO: replace when Issue #2 is closed
        Object.keys(data).map(function (key) {
            return data[key];
        })).then(function (results) {
            var stations = {};
            for (let i = 0; i < results.length; i++) {
                var measurments = results[i];

                for (let j = 0; j < measurments.length; j++) {
                    var measurment = measurments[j].split(';');

                    if (!stations[measurment[0]]) {
                        stations[measurment[0]] = {
                            coordinates: [(0, _luref2.default)(measurment[5]), (0, _luref2.default)(measurment[6])]
                        };
                    }
                    stations[measurment[0]][sources[i]] = parseFloat(measurment[3]);
                }
            }

            for (var key in stations) {
                if (stations.hasOwnProperty(key)) {
                    stations[key] = compileWeatherStation(key, stations[key]);
                }
            }

            return {
                type: 'FeatureCollection',
                features: stations
            };
        });
    });

    return function load() {
        return _ref3.apply(this, arguments);
    };
})();

const compileWeatherStation = exports.compileWeatherStation = (name, weatherStation) => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: weatherStation.coordinates
        },
        properties: {
            id: 'aev:' + name,
            name: name,
            temp: weatherStation.temp || null,
            pm10: weatherStation.pm10 || null,
            no2: weatherStation.no2 || null,
            o3: weatherStation.o3 || null,
            so2: weatherStation.so2 || null,
            co: weatherStation.co || null
        }
    };
};