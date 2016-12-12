'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStation = exports.station = exports.stations = undefined;

var _velok = require('../source/bikepoint/velok');

var velok = _interopRequireWildcard(_velok);

var _veloh = require('../source/bikepoint/veloh');

var veloh = _interopRequireWildcard(_veloh);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const stations = exports.stations = () => {

    const sources = {
        'velok': velok.stations(),
        'veloh': veloh.stations()
    };

    var providers = Object.keys(sources);

    return Promise.all(
    //TODO: replace when Issue #2 is closed
    Object.keys(sources).map(key => sources[key])).then(results => {

        var stations = [];

        for (let i = 0; i < results.length; i++) {
            stations = [...stations, ...results[i].map(station => compileStation(providers[i], station))];
        }

        return stations;
    });
};

const station = exports.station = id => {
    return id;
};

const compileStation = exports.compileStation = function (provider, station) {

    station.id = provider + ':' + station.id;

    return station;
};