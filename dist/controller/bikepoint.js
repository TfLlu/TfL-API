'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = exports.box = exports.around = exports.get = exports.streamIndex = exports.index = undefined;

var _bikepoint = require('../service/bikepoint');

var bikepoint = _interopRequireWildcard(_bikepoint);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const index = exports.index = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
        console.log('client connected to /BikePoint');
        ctx.body = yield bikepoint.all();
    });

    return function index(_x) {
        return _ref.apply(this, arguments);
    };
})();

const streamIndex = exports.streamIndex = ({ emit, disconnect }) => {
    console.log('client connected to /stream/BikePoint');
    var res = bikepoint.stream(data => {
        emit(data);
    });

    disconnect(() => {
        res.off();
    });
};

const get = exports.get = (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
        ctx.body = yield bikepoint.get(ctx.params.bikePoint);
    });

    return function get(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref3 = _asyncToGenerator(function* (ctx) {
        ctx.body = yield bikepoint.around(parseFloat(ctx.params.lon), parseFloat(ctx.params.lat), ctx.params.radius);
    });

    return function around(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref4 = _asyncToGenerator(function* (ctx) {
        ctx.body = yield bikepoint.box(parseFloat(ctx.params.swlon), parseFloat(ctx.params.swlat), parseFloat(ctx.params.nelon), parseFloat(ctx.params.nelat));
    });

    return function box(_x4) {
        return _ref4.apply(this, arguments);
    };
})();

const search = exports.search = (() => {
    var _ref5 = _asyncToGenerator(function* (ctx) {
        ctx.body = yield bikepoint.search(ctx.params.searchstring.toLowerCase());
    });

    return function search(_x5) {
        return _ref5.apply(this, arguments);
    };
})();