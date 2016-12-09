import Koa        from 'koa';
import KoaRouter  from 'koa-router';
import controller from './controller';
import monitor    from './monitor';
import config     from './config';

const app    = new Koa();
const router = new KoaRouter();

router.get('/', controller.home.index);
router.get('/BikePoint/:id', controller.bikepoint.index);

app.use(monitor)
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(config('SERVER_PORT', true));
