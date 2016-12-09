'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.index = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _xml2js = require('xml2js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//var parseString = require('xml2js').parseString;
//import xml2js from 'xml2js';


//var xmlParser = new xml2js.Parser().parseString;
var xmlOptions = {
    async: true,
    trim: true,
    explicitArray: false
};

const index = exports.index = (() => {
    var _ref = _asyncToGenerator(function* (ctx) {

        //const result = await request('https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=1835af14f29db63b765a3335ba42891323ce8f12');

        const result = yield (0, _requestPromiseNative2.default)('https://webservice.velok.lu/station.aspx');

        return new Promise(function (resolve, reject) {
            (0, _xml2js.parseString)(result, xmlOptions, function (error, data) {

                if (error) {
                    reject(error);
                }

                ctx.body = {
                    'hello': 'world',
                    'data': data['velok']['station']
                };
                resolve();
            });
        });

        //ctx.body = result;

        //ctx.body = '<h1>Hello Bikepoint \\o/' + ctx.params.id + '</h1>';
    });

    return function index(_x) {
        return _ref.apply(this, arguments);
    };
})();

/*const get = function(bla) {
    return 'test [' + bla + '] done...';
};
*/