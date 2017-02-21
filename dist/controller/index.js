'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _home = require('./home');

var home = _interopRequireWildcard(_home);

var _test = require('./test');

var test = _interopRequireWildcard(_test);

var _bikepoint = require('./bikepoint');

var bikepoint = _interopRequireWildcard(_bikepoint);

var _occupancy = require('./occupancy');

var occupancy = _interopRequireWildcard(_occupancy);

var _carpark = require('./occupancy/carpark');

var carpark = _interopRequireWildcard(_carpark);

var _stoppoint = require('./stoppoint');

var stoppoint = _interopRequireWildcard(_stoppoint);

var _departures = require('./stoppoint/departures');

var departures = _interopRequireWildcard(_departures);

var _journey = require('./journey');

var journey = _interopRequireWildcard(_journey);

var _weather = require('./weather');

var weather = _interopRequireWildcard(_weather);

var _airquality = require('./weather/airquality');

var airquality = _interopRequireWildcard(_airquality);

var _highway = require('./highway');

var highway = _interopRequireWildcard(_highway);

var _line = require('./line');

var line = _interopRequireWildcard(_line);

var _route = require('./line/route');

var route = _interopRequireWildcard(_route);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = { home, test, bikepoint, occupancy, carpark, stoppoint, departures, journey, weather, airquality, highway, line, route };