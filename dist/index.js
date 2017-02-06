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

var _influxdbNodejs = require('influxdb-nodejs');

var _influxdbNodejs2 = _interopRequireDefault(_influxdbNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();
const router = new _koaRouter2.default();

router.use(_monitor.middleware.routeAccess(router));

router.get('/', _controller2.default.home.index);
router.get('/BikePoint', _controller2.default.bikepoint.index);
router.io('/BikePoint', _controller2.default.bikepoint.streamIndex);
router.get('/BikePoint/:bikePoint', _controller2.default.bikepoint.get);
router.get('/BikePoint/around/:lon/:lat/:radius', _controller2.default.bikepoint.around);
router.get('/BikePoint/box/:swlon/:swlat/:nelon/:nelat', _controller2.default.bikepoint.box);
router.get('/BikePoint/search/:searchstring', _controller2.default.bikepoint.search);
router.get('/Occupancy/CarPark', _controller2.default.carpark.index);
router.get('/Occupancy/CarPark/:carPark', _controller2.default.carpark.get);
router.get('/StopPoint', _controller2.default.stoppoint.index);
router.io('/StopPoint', _controller2.default.stoppoint.streamIndex);
router.get('/StopPoint/:stopPoint', _controller2.default.stoppoint.get);
router.get('/StopPoint/around/:lon/:lat/:radius', _controller2.default.stoppoint.around);
router.get('/StopPoint/box/:swlon/:swlat/:nelon/:nelat', _controller2.default.stoppoint.box);
router.get('/StopPoint/search/:searchstring', _controller2.default.stoppoint.search);
router.io('/StopPoint/Departures', _controller2.default.departures.streamIndex);
router.get('/StopPoint/Departures/:stopPoint', _controller2.default.departures.get);
router.get('/StopPoint/Departures/:stopPoint/:limit', _controller2.default.departures.load);
router.get('/Journey/:from/to/:to', _controller2.default.journey.plan);
router.get('/Weather', _controller2.default.weather.current);

app.use((0, _monitor2.default)()).use(_monitor.middleware.responseTime()).use(router.routes()).use(router.allowedMethods());

const server = (0, _http.Server)(app.callback());
_stream2.default.bind(server, router);

const PORT = (0, _config2.default)('SERVER_PORT', true);
if (PORT) {
    server.listen(PORT);
}

var influxdb = false;

const streamCountToInflux = () => {
    influxdb.write('streamConnections').field({
        endpoint: '/departures',
        count: _controller2.default.departures.streamCount()
    }).then();
    influxdb.write('streamConnections').field({
        endpoint: '/bikepoint',
        count: _controller2.default.bikepoint.streamCount()
    }).then();
    setInterval(streamCountToInflux, 10000);
};

if ((0, _config2.default)('INFLUXDB')) {
    influxdb = new _influxdbNodejs2.default((0, _config2.default)('INFLUXDB') + (0, _config2.default)('NAME_VERSION'));
    streamCountToInflux();
}

exports.default = server;