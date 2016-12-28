'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileSituation = exports.current = exports.get = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = () => {
    return (0, _requestPromiseNative2.default)('http://meteolux.lu/Opendata/data_LUX_actual.csv');
};

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (bikePoint) {

        var raw = yield getRaw(bikePoint);
        var lines = raw.trim().split('\r\n');
        var result = {};

        for (var i = 0; i < lines.length; i++) {
            var lineParts = lines[i].split(';');

            result[lineParts[0]] = lineParts[1];
        }

        return result;
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
    };
})();

const current = exports.current = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var situation = yield get();
        return compileSituation(situation);
    });

    return function current() {
        return _ref2.apply(this, arguments);
    };
})();

const compileSituation = exports.compileSituation = situation => {

    var windDirection = '';

    switch (situation.wind_direction_text.toUpperCase()) {
        case 'N':
            windDirection = 360;
            break;
        case 'NE':
            windDirection = 45;
            break;
        case 'E':
            windDirection = 90;
            break;
        case 'SE':
            windDirection = 135;
            break;
        case 'S':
            windDirection = 180;
            break;
        case 'SO':
            windDirection = 225;
            break;
        case 'O':
            windDirection = 270;
            break;
        case 'NO':
            windDirection = 315;
            break;
    }

    var visibility = parseInt(situation.visibility);

    if (situation.visibility.indexOf('km') !== -1) {
        visibility = visibility * 1000;
    }

    return {
        coord: {
            lat: 49.627688,
            lon: 6.223234
        },
        weather: [{
            id: null,
            main: null,
            description: situation.weather,
            icon: null
        }],
        base: null,
        main: {
            temp: parseInt(situation.temp),
            pressure: parseInt(situation.pressure),
            humidity: parseInt(situation.humidity),
            temp_min: null,
            temp_max: null
        },
        visibility: visibility,
        wind: {
            speed: parseInt(situation.wind_force),
            deg: windDirection
        },
        clouds: {
            all: null
        },
        dt: null,
        sys: {
            type: null,
            id: null,
            message: null,
            country: null,
            sunrise: null,
            sunset: null
        },
        id: null,
        name: 'Findel',
        cod: 200
    };
};