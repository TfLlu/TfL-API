'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = undefined;

var _mobiliteit = require('../../source/stoppoint/mobiliteit');

var mobiliteit = _interopRequireWildcard(_mobiliteit);

var _stoppoint = require('../stoppoint');

var stoppoint = _interopRequireWildcard(_stoppoint);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (stopPoint, limit) {
        var departuresRaw = yield mobiliteit.departures(stopPoint, limit);
        var departures = [];
        var rawDepartures = departuresRaw.Departure;
        if (rawDepartures) {
            for (var i = 0; i < rawDepartures.length; i++) {
                var departure = {};
                if (!rawDepartures[i].Product.operatorCode) {
                    departure.type = 'bus';
                    departure.trainId = null;
                } else {
                    switch (rawDepartures[i].Product.operatorCode.toLowerCase()) {
                        case 'cfl':
                            departure.type = 'train';
                            departure.trainId = rawDepartures[i].Product.name.replace(/ +/g, ' ');
                            break;
                        default:
                            departure.type = 'bus';
                            departure.trainId = null;
                            break;
                    }
                }
                departure.line = rawDepartures[i].Product.line.trim();
                departure.number = parseInt(rawDepartures[i].Product.num.trim(), 10);

                var time = Math.round(Date.parse(rawDepartures[i].date + ' ' + rawDepartures[i].time) / 1000);
                if (rawDepartures[i].rtDate) {
                    var realTime = Math.round(Date.parse(rawDepartures[i].rtDate + ' ' + rawDepartures[i].rtTime) / 1000);
                    departure.departure = realTime;
                    departure.delay = realTime - time;
                    departure.live = true;
                } else {
                    departure.departure = time;
                    departure.delay = 0;
                    departure.live = false;
                }
                departure.departureISO = _moment2.default.unix(departure.departure).format();
                departure.destination = rawDepartures[i].direction;
                var destination = yield stoppoint.getByName(departure.destination);
                if (typeof destination !== 'undefined') {
                    departure.destinationId = destination.properties.id;
                } else {
                    departure.destinationId = null;
                }
                departures.push(departure);
            }
        }
        return departures;
    });

    return function get(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();