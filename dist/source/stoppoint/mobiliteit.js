'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.departures = exports.load = undefined;

var _requests = require('../../requests');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const load = exports.load = (() => {
    var _ref = _asyncToGenerator(function* () {
        var raw = yield (0, _requests.mobiliteitStoppoints)();
        var StopPoints = raw.trim().split('\n');
        return StopPoints.map(compileStopPoint);
    });

    return function load() {
        return _ref.apply(this, arguments);
    };
})();

const compileStopPoint = stopPoint => {
    var paramParts = stopPoint.split('@');
    var params = {};
    for (var j = 0; j < paramParts.length; j++) {
        var keyVal = paramParts[j].split('=', 2);
        params[keyVal[0]] = keyVal[1];
    }
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [parseFloat(params.X.replace(',', '.')), parseFloat(params.Y.replace(',', '.'))]
        },
        properties: {
            id: parseInt(params.L, 10),
            name: params.O
        }
    };
};

const departures = exports.departures = (stopPoint, maxJourneys) => (0, _requests.mobiliteitDeparture)(stopPoint, maxJourneys);