import Koa       from 'koa';
import KoaRouter from 'koa-router';

const app    = new Koa();
const router = new KoaRouter();

router.get('/', ctx => {
    ctx.body = '<h1>TFL API</h1>';
});

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(9000);
