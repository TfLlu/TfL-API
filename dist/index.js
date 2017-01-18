'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _http = require('http');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _stream = require('./stream');

var _stream2 = _interopRequireDefault(_stream);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _monitor = require('./monitor');

var _monitor2 = _interopRequireDefault(_monitor);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();
const router = new _koaRouter2.default();

router.use(_monitor.middleware.routeAccess(router));

router.get('/', _controller2.default.home.index);
router.get('/BikePoint', _controller2.default.bikepoint.index);
router.get('/BikePoint/:bikePoint', _controller2.default.bikepoint.get);
router.get('/BikePoint/around/:lon/:lat/:radius', _controller2.default.bikepoint.around);
router.get('/BikePoint/box/:swlon/:swlat/:nelon/:nelat', _controller2.default.bikepoint.box);
router.get('/BikePoint/search/:searchstring', _controller2.default.bikepoint.search);
router.get('/Occupancy/CarPark', _controller2.default.carpark.index);
router.get('/Occupancy/CarPark/:carPark', _controller2.default.carpark.get);
router.get('/StopPoint', _controller2.default.stoppoint.index);
router.get('/StopPoint/:stopPoint', _controller2.default.stoppoint.get);
router.get('/StopPoint/Departures/:stopPoint', _controller2.default.stoppoint.departures);
router.get('/StopPoint/Departures/:stopPoint/:limit', _controller2.default.stoppoint.departures);
router.get('/StopPoint/around/:lon/:lat/:radius', _controller2.default.stoppoint.around);
router.get('/StopPoint/box/:swlon/:swlat/:nelon/:nelat', _controller2.default.stoppoint.box);
router.get('/StopPoint/search/:searchstring', _controller2.default.stoppoint.search);
router.get('/Journey/:from/to/:to', _controller2.default.journey.plan);
router.get('/Weather', _controller2.default.weather.current);
router.io('/test/:value', _controller2.default.test.index);

app.use((0, _monitor2.default)()).use(_monitor.middleware.responseTime()).use(router.routes()).use(router.allowedMethods());

const server = (0, _http.Server)(app.callback());
_stream2.default.bind(server, router);

const PORT = (0, _config2.default)('SERVER_PORT', true);
if (PORT) {
   server.listen(PORT);
}

exports.default = server;