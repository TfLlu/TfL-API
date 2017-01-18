"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const onData = data => {};

const routeAccess = router => {
    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            const startTime = Date.now();
            yield next();
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            const matched = router.match(ctx.request.url, ctx.request.method);
            const layer = matched.pathAndMethod[matched.pathAndMethod.length - 1];

            const data = {
                path: layer.path,
                time: responseTime
            };
            ctx.monitor.ROUTE_ACCESS = data;
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })();
};

const responseTime = () => {
    return (() => {
        var _ref2 = _asyncToGenerator(function* (ctx, next) {
            const startTime = Date.now();
            yield next();
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            ctx.monitor.RESPONSE_TIME = {
                url: ctx.request.url,
                method: ctx.request.method,
                status: ctx.response.status,
                time: responseTime
            };
            console.log(`Response Time: ${ responseTime }ms`);
        });

        return function (_x3, _x4) {
            return _ref2.apply(this, arguments);
        };
    })();
};

const requestTime = response => {
    const requestTime = response.config.endTime - response.config.startTime;
    onData({
        REQUEST_TIME: {
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            time: requestTime
        }
    });
};

const middleware = {
    responseTime,
    routeAccess
};

exports.requestTime = requestTime;
exports.middleware = middleware;

exports.default = () => {
    return (() => {
        var _ref3 = _asyncToGenerator(function* (ctx, next) {
            ctx.monitor = {};
            yield next();
            onData(ctx.monitor);
        });

        return function (_x5, _x6) {
            return _ref3.apply(this, arguments);
        };
    })();
};