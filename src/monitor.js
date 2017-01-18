const onData = data => {};

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
            time: responseTime
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
            time: responseTime
        };
        console.log(`Response Time: ${responseTime}ms`);
    };
};

export const middleware = {
    responseTime,
    routeAccess
};

export default () => {
    return async (ctx, next) => {
        ctx.monitor = {};
        await next();
        onData(ctx.monitor);
    };
};
