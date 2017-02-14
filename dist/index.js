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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const app = new _koa2.default();
const router = new _koaRouter2.default();

router.use(_monitor.middleware.routeAccess(router));

router.get('/', _controller2.default.home.index);
router.get('/BikePoint', _controller2.default.bikepoint.index);
router.io('/BikePoint', _controller2.default.bikepoint.fireHose);
router.get('/BikePoint/:bikePoint', _controller2.default.bikepoint.get);
router.io('/BikePoint/:bikePoint', _controller2.default.bikepoint.streamSingle);
router.get('/BikePoint/around/:lon/:lat/:radius', _controller2.default.bikepoint.around);
router.get('/BikePoint/box/:swlon/:swlat/:nelon/:nelat', _controller2.default.bikepoint.box);
router.get('/BikePoint/search/:searchstring', _controller2.default.bikepoint.search);
router.get('/Occupancy/CarPark', _controller2.default.carpark.index);
router.io('/Occupancy/CarPark', _controller2.default.carpark.fireHose);
router.get('/Occupancy/CarPark/:carPark', _controller2.default.carpark.get);
router.io('/Occupancy/CarPark/:carPark', _controller2.default.carpark.streamSingle);
router.get('/StopPoint', _controller2.default.stoppoint.index);
router.io('/StopPoint', _controller2.default.stoppoint.streamIndex);
router.get('/StopPoint/Departures', _controller2.default.departures.index);
router.get('/StopPoint/:stopPoint', _controller2.default.stoppoint.get);
router.get('/StopPoint/around/:lon/:lat/:radius', _controller2.default.stoppoint.around);
router.get('/StopPoint/box/:swlon/:swlat/:nelon/:nelat', _controller2.default.stoppoint.box);
router.get('/StopPoint/search/:searchstring', _controller2.default.stoppoint.search);
router.io('/StopPoint/Departures', _controller2.default.departures.fireHose);
router.get('/StopPoint/Departures/:stopPoint', _controller2.default.departures.get);
router.io('/StopPoint/Departures/:stopPoint', _controller2.default.departures.streamSingle);
router.get('/StopPoint/Departures/:stopPoint/:limit', _controller2.default.departures.load);
router.get('/Journey/:from/to/:to', _controller2.default.journey.plan);
router.get('/Weather', _controller2.default.weather.current);
router.io('/Weather', _controller2.default.weather.streamSingle);
router.get('/Weather/AirQuality', _controller2.default.airquality.index);
router.io('/Weather/AirQuality', _controller2.default.airquality.fireHose);
router.get('/Weather/AirQuality/:weatherStation', _controller2.default.airquality.get);
router.io('/Weather/AirQuality/:weatherStation', _controller2.default.airquality.streamSingle);

app.use((0, _monitor2.default)()).use(_monitor.middleware.responseTime()).use((() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
        yield next();
        ctx.type = 'application/json';
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})()).use(router.routes()).use(router.allowedMethods());

const server = (0, _http.Server)(app.callback());
_stream2.default.bind(server, router);

const PORT = (0, _config2.default)('SERVER_PORT', true);
if (PORT) {
    server.listen(PORT);
}

var influxdb = false;

const streamCountToInflux = () => {
    influxdb.write('streamConnections').field({
        departures: _controller2.default.departures.streamCount(),
        bikepoint: _controller2.default.bikepoint.streamCount(),
        carpark: _controller2.default.carpark.streamCount(),
        weather: _controller2.default.weather.streamCount(),
        airquality: _controller2.default.airquality.streamCount()
    }).then();
    return;
};

if ((0, _config2.default)('INFLUXDB')) {
    influxdb = new _influxdbNodejs2.default((0, _config2.default)('INFLUXDB') + (0, _config2.default)('NAME_VERSION'));
    setInterval(streamCountToInflux, 10000);
}

exports.default = server;