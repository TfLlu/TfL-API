import config from './config';
import Influx from 'influxdb-nodejs';

var influxdb = false;
if (config('INFLUXDB')) {
    influxdb = new Influx(config('INFLUXDB') + config('NAME_VERSION'));
}

const onData = data => {
    if (!influxdb)
        return;
    if (data.RESPONSE_TIME) {
        if (data.ROUTE_ACCESS) {
            data.RESPONSE_TIME.path = data.ROUTE_ACCESS.path;
        }
        influxdb.write('responses')
            .field(data.RESPONSE_TIME)
            .then()
            .catch(err => {
                console.log('INFLUX DB ERROR', err.message);
            });
    } else if (data.REQUEST_TIME) {
        influxdb.write('requests')
            .field(data.REQUEST_TIME)
            .then()
            .catch(err => {
                console.log('INFLUX DB ERROR', err.message);
            });
    }
};

const routeAccess = (router) => {
    return async (ctx, next) => {
        const startTime = Date.now();

        const setMonitorData = () => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            const matched = router.match(ctx.request.url, ctx.request.method);
            const layer = matched.pathAndMethod[matched.pathAndMethod.length - 1];

            ctx.monitor.ROUTE_ACCESS = {
                path: layer.path,
                responseTime
            };
        };

        try {
            await next();
        } catch (err) {
            setMonitorData();
            throw err;
        }

        setMonitorData();
    };
};

const responseTime = () => {
    return async (ctx, next) => {
        const startTime = Date.now();

        const setMonitorData = (status) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            ctx.monitor.RESPONSE_TIME = {
                url: ctx.request.url,
                method: ctx.request.method,
                status: status || ctx.response.status,
                responseTime
            };
        };
        try {
            await next();
        } catch (err) {
            setMonitorData(500);
            throw err;
        }

        setMonitorData();
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
        try {
            await next();
        } catch (err) {
            onData(ctx.monitor);
            throw err;
        }
        onData(ctx.monitor);
    };
};
