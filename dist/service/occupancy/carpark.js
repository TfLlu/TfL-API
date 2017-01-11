'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileCarPark = exports.get = exports.all = undefined;

var _vdl = require('../../source/occupancy/carpark/vdl');

var vdl = _interopRequireWildcard(_vdl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const all = exports.all = () => {
    const sources = {
        'vdl': vdl.all()
    };
    var providers = Object.keys(sources);
    return Promise.all(
    //TODO: replace when Issue #2 is closed
    Object.keys(sources).map(key => sources[key])).then(results => {
        var items = [];
        for (let i = 0; i < results.length; i++) {
            items = [...items, ...results[i].map(item => compileCarPark(providers[i], item))];
        }
        return {
            type: 'FeatureCollection',
            features: items
        };
    });
};

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (carPark) {
        var carParkSplit = carPark.split(':');
        var provider = carParkSplit[0];
        switch (provider) {
            case 'vdl':
                carPark = yield vdl.get(carParkSplit[1]);
                break;
            default:
                //TODO: implement not found
                return false;
        }
        return compileCarPark(provider, carPark);
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
    };
})();

const compileCarPark = exports.compileCarPark = function (provider, item) {
    item.properties.id = provider + ':' + item.properties.id;
    return item;
};