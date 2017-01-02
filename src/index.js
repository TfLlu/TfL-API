import Koa        from 'koa';
import KoaRouter  from 'koa-router';
import controller from './controller';
import monitor    from './monitor';
import config     from './config';

const app    = new Koa();
const router = new KoaRouter();

router.get('/',                                          controller.home.index);
router.get('/BikePoint',                                 controller.bikepoint.index);
router.get('/BikePoint/:bikePoint',                      controller.bikepoint.get);
router.get('/BikePoint/around/:lon/:lat/:radius',        controller.bikepoint.around);
router.get('/BikePoint/box/:swlon/:swlat/:nelon/:nelat', controller.bikepoint.box);
router.get('/Occupancy/CarPark',                         controller.carpark.index);
router.get('/StopPoint',                                 controller.stoppoint.index);
router.get('/StopPoint/:stopPoint',                      controller.stoppoint.get);
router.get('/StopPoint/around/:lon/:lat/:radius',        controller.stoppoint.around);
router.get('/StopPoint/box/:swlon/:swlat/:nelon/:nelat', controller.stoppoint.box);
router.get('/StopPoint/search/:searchstring',            controller.stoppoint.search);
router.get('/Journey/:from/to/:to',                      controller.journey.plan);
router.get('/Weather',                                   controller.weather.current);

app.use(monitor)
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(config('SERVER_PORT', true));
