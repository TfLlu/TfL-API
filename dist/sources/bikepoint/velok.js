'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileStation = exports.stations = exports.get = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _xml2js = require('xml2js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var xmlOptions = {
    async: true,
    trim: true,
    explicitArray: false
};

const getRaw = () => (0, _requestPromiseNative2.default)('https://webservice.velok.lu/station.aspx');

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* () {

        var raw = yield getRaw();

        return new Promise(function (resolve, reject) {
            (0, _xml2js.parseString)(raw, xmlOptions, function (error, data) {

                if (error) {
                    reject(error);
                }
                resolve(data['velok']['station']);
            });
        });
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
    return item;
};