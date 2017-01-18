import config from './config';
import Influx from 'influxdb-nodejs';


var influxdb = false;
if (config('INFLUXDB')) {
    influxdb = new Influx(config('INFLUXDB'));
}

const onData = data => {
    if (!influxdb)
        return;
    if (data.RESPONSE_TIME) {
        influxdb.write('responses')
            .field(data.RESPONSE_TIME)
            .then();
    } else if (data.REQUEST_TIME) {
        influxdb.write('requests')
            .field(data.REQUEST_TIME)
            .then();
    }
};

const routeAccess = (router) => {
    return async (ctx, next) => {
        const startTime = Date.now();
        await next();
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const matched = router.match(ctx.request.url, ctx.request.method);
        const layer = matched.pathAndMethod[matched.pathAndMethod.length - 1];

        const data = {
            path: layer.path,
            responseTime
        };
        ctx.monitor.ROUTE_ACCESS = data;
    };
};

const responseTime = () => {
    return async (ctx, next) => {
        const startTime = Date.now();
        await next();
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        ctx.monitor.RESPONSE_TIME = {
            url: ctx.request.url,
            method: ctx.request.method,
            status: ctx.response.status,
            responseTime
        };
        //console.log(`Response Time: ${responseTime}ms`);
    };
};

const requestTime = response => {
    const requestTime = response.config.endTime - response.config.startTime;
    onData({
        REQUEST_TIME: {
            name: response.config.name || null,
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            requestTime
        }
    });
};

const middleware = {
    responseTime,
    routeAccess
};

export { requestTime, middleware };

export default () => {
    return async (ctx, next) => {
        ctx.monitor = {};
        await next();
        onData(ctx.monitor);
    };
};
