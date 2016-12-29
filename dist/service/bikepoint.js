'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStation = exports.get = exports.all = undefined;

var _velok = require('../source/bikepoint/velok');

var velok = _interopRequireWildcard(_velok);

var _veloh = require('../source/bikepoint/veloh');

var veloh = _interopRequireWildcard(_veloh);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const all = exports.all = () => {

    const sources = {
        'velok': velok.all(),
        'veloh': veloh.all()
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

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (bikePoint) {
        var bikePointSplit = bikePoint.split(':');
        switch (bikePointSplit[0]) {
            case 'veloh':
                bikePoint = yield veloh.get(bikePointSplit[1]);
                break;
            case 'velok':
                bikePoint = yield velok.get(bikePointSplit[1]);
                break;
        }
        return compileStation(bikePointSplit[0], bikePoint);
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
    };
})();

const compileStation = exports.compileStation = function (provider, bikePoint) {
    bikePoint.id = provider + ':' + bikePoint.id;
    return bikePoint;
};