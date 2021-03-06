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
router.io ('/BikePoint',                                 controller.bikepoint.fireHose);
router.get('/BikePoint/:bikePoint',                      controller.bikepoint.get);
router.io ('/BikePoint/:bikePoint',                      controller.bikepoint.streamSingle);
router.get('/BikePoint/around/:lon/:lat/:radius',        controller.bikepoint.around);
router.get('/BikePoint/box/:swlon/:swlat/:nelon/:nelat', controller.bikepoint.box);
router.get('/BikePoint/search/:searchstring',            controller.bikepoint.search);
router.get('/Occupancy/CarPark',                         controller.carpark.index);
router.io ('/Occupancy/CarPark',                         controller.carpark.fireHose);
router.get('/Occupancy/CarPark/:carPark',                controller.carpark.get);
router.io ('/Occupancy/CarPark/:carPark',                controller.carpark.streamSingle);
router.get('/StopPoint',                                 controller.stoppoint.index);
router.io ('/StopPoint',                                 controller.stoppoint.streamIndex);
router.get('/StopPoint/Departures',                      controller.departures.index);
router.get('/StopPoint/:stopPoint',                      controller.stoppoint.get);
router.get('/StopPoint/around/:lon/:lat/:radius',        controller.stoppoint.around);
router.get('/StopPoint/box/:swlon/:swlat/:nelon/:nelat', controller.stoppoint.box);
router.get('/StopPoint/search/:searchstring',            controller.stoppoint.search);
router.io ('/StopPoint/Departures',                      controller.departures.fireHose);
router.get('/StopPoint/Departures/:stopPoint',           controller.departures.get);
router.io ('/StopPoint/Departures/:stopPoint',           controller.departures.streamSingle);
router.get('/StopPoint/Departures/:stopPoint/:limit',    controller.departures.limit);
router.get('/Journey/:from/to/:to',                      controller.journey.plan);
router.get('/Weather',                                   controller.weather.current);
router.io ('/Weather',                                   controller.weather.streamSingle);
router.get('/Weather/AirQuality',                        controller.airquality.index);
router.io ('/Weather/AirQuality',                        controller.airquality.fireHose);
router.get('/Weather/AirQuality/:weatherStation',        controller.airquality.get);
router.io ('/Weather/AirQuality/:weatherStation',        controller.airquality.streamSingle);
router.get('/Highway',                                   controller.highway.index);
router.io ('/Highway',                                   controller.highway.fireHose);
router.get('/Highway/:highway',                          controller.highway.get);
router.io ('/Highway/:highway',                          controller.highway.streamSingle);
router.get('/Line',                                      controller.line.index);
router.get('/Line/Route',                                controller.route.index);
router.get('/Line/:line',                                controller.line.get);
router.get('/Line/:line/StopPoints',                     controller.line.stopPoints);
router.get('/Line/Mode/:mode',                           controller.mode.get);
router.get('/Line/:line/Route',                          controller.route.byLine);
router.get('/Line/Mode/:mode/Route',                     controller.mode.getRoutes);
router.get('/AirPort/Departures',                        controller.airport.departuresIndex);
router.get('/AirPort/Arrivals',                          controller.airport.arrivalsIndex);

app.use(monitor())
   .use(middleware.responseTime())
   .use(async (ctx, next) => {
       await next();
       ctx.type = 'application/json';
   })
   .use(router.routes())
   .use(router.allowedMethods());

const server = Server(app.callback());
Stream.bind(server, router);

const PORT = config('SERVER_PORT', true);
if (PORT) {
    server.listen(PORT, 'localhost');
}

export default server;
