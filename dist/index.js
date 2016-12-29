'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _monitor = require('./monitor');

var _monitor2 = _interopRequireDefault(_monitor);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();
const router = new _koaRouter2.default();

router.get('/', _controller2.default.home.index);
router.get('/BikePoint', _controller2.default.bikepoint.index);
router.get('/BikePoint/:bikePoint', _controller2.default.bikepoint.show);
router.get('/Occupancy/CarPark', _controller2.default.carpark.index);
router.get('/StopPoint', _controller2.default.stoppoint.index);
router.get('/StopPoint/:stopPoint', _controller2.default.stoppoint.show);
router.get('/StopPoint/around/:lon/:lat/:radius', _controller2.default.stoppoint.around);
router.get('/Journey/:from/to/:to', _controller2.default.journey.plan);
router.get('/Weather', _controller2.default.weather.current);

app.use(_monitor2.default).use(router.routes()).use(router.allowedMethods());

app.listen((0, _config2.default)('SERVER_PORT', true));