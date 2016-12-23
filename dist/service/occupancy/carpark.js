'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStation = exports.item = exports.items = undefined;

var _vdl = require('../../source/occupancy/carpark/vdl');

var parkingVDL = _interopRequireWildcard(_vdl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const items = exports.items = () => {

    const sources = {
        'carparkVDL': parkingVDL.items()
    };

    var providers = Object.keys(sources);

    return Promise.all(
    //TODO: replace when Issue #2 is closed
    Object.keys(sources).map(key => sources[key])).then(results => {

        var items = [];

        for (let i = 0; i < results.length; i++) {
            items = [...items, ...results[i].map(item => compileStation(providers[i], item))];
        }

        return items;
    });
};

const item = exports.item = (() => {
    var _ref = _asyncToGenerator(function* (_item) {
        _item = _item.split(':');
        return yield parkingVDL.item(_item[1]);
    });

    return function item(_x) {
        return _ref.apply(this, arguments);
    };
})();

const compileStation = exports.compileStation = function (provider, item) {

    item.id = provider + ':' + item.id;

    return item;
};