'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.departures = undefined;

var _requests = require('../../requests');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const departures = exports.departures = (() => {
    var _ref = _asyncToGenerator(function* () {
        var raw = yield (0, _requests.luxairportDepartures)();
        var departures = raw['departures'].map(compilePlaneDeparture);
        departures.sort(function (a, b) {
            return a.departure - b.departure;
        });
        return departures;
    });

    return function departures() {
        return _ref.apply(this, arguments);
    };
})();

const compilePlaneDeparture = plane => {

    var departure, delay, live;

    var scheduled = (0, _moment2.default)(plane.scheduledTime, 'HH:mm').unix();
    var estimated = (0, _moment2.default)(plane.estimatedTime, 'HH:mm').unix();

    if (plane.estimatedTime == '') {
        departure = scheduled;
        delay = 0;
        live = false;
    } else {
        departure = estimated;
        delay = departure - scheduled;
        live = true;
    }

    return {
        id: plane.flight_id,
        type: 'plane',
        trainId: null,
        lineId: null,
        line: plane.airportName,
        number: plane.flightNumber,
        live: live,
        departure: departure,
        delay: delay,
        departureISO: _moment2.default.unix(departure).format(),
        destination: plane.airportName,
        destinationId: null
    };
};