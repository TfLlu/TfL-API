import { Server }     from 'http';
import Koa            from 'koa';
import KoaRouter      from 'koa-router';
import Stream         from './stream';
import controller     from './controller';
import { middleware } from './monitor';
import monitor        from './monitor';
import config         from './config';

const app    = new Koa();
const router = new KoaRouter();

router.use(middleware.routeAccess(router));

router.get('/',                                          controller.home.index);
router.get('/BikePoint',                                 controller.bikepoint.index);
router.get('/BikePoint/:bikePoint',                      controller.bikepoint.get);
router.get('/BikePoint/around/:lon/:lat/:radius',        controller.bikepoint.around);
router.get('/BikePoint/box/:swlon/:swlat/:nelon/:nelat', controller.bikepoint.box);
router.get('/BikePoint/search/:searchstring',            controller.bikepoint.search);
router.get('/Occupancy/CarPark',                         controller.carpark.index);
router.get('/Occupancy/CarPark/:carPark',                controller.carpark.get);
router.get('/StopPoint',                                 controller.stoppoint.index);
router.get('/StopPoint/:stopPoint',                      controller.stoppoint.get);
router.get('/StopPoint/Departures/:stopPoint',           controller.stoppoint.departures);
router.get('/StopPoint/Departures/:stopPoint/:limit',    controller.stoppoint.departures);
router.get('/StopPoint/around/:lon/:lat/:radius',        controller.stoppoint.around);
router.get('/StopPoint/box/:swlon/:swlat/:nelon/:nelat', controller.stoppoint.box);
router.get('/StopPoint/search/:searchstring',            controller.stoppoint.search);
router.get('/Journey/:from/to/:to',                      controller.journey.plan);
router.get('/Weather',                                   controller.weather.current);
router.io('/test/:value',                                controller.test.index);

app.use(monitor())
   .use(middleware.responseTime())
   .use(router.routes())
   .use(router.allowedMethods());

const server = Server(app.callback());
Stream.bind(server, router);

const PORT = config('SERVER_PORT', true);
if (PORT) {
    server.listen(PORT);
}

export default server;
