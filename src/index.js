import Koa        from 'koa';
import KoaRouter  from 'koa-router';
import controller from './controller';

const app    = new Koa();
const router = new KoaRouter();

router.get('/', controller.home.index);

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(9000);
