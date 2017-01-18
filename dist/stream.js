'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_koaRouter2.default.prototype.io = function (name, path, middleware) {
    if (typeof path === 'string' || path instanceof RegExp) {
        middleware = Array.prototype.slice.call(arguments, 2);
    } else {
        middleware = Array.prototype.slice.call(arguments, 1);
        path = name;
        name = null;
    }

    this.register(path, ['io'], middleware, {
        name: name
    });

    return this;
};

const Stream = {
    bind(server, router) {
        // add Method for stream
        router.methods.push('IO');
        const io = (0, _socket2.default)(server, {
            path: '/stream'
        });
        io.on('connection', socket => {
            const disconnectCallbacks = [];
            const addDisconnectCallback = callback => disconnectCallbacks.push(callback);
            const disconnect = function () {
                disconnectCallbacks.forEach(callback => callback.apply(socket, arguments));
            };
            socket.on('disconnect', disconnect);

            socket.on('subscribe', path => {
                const matched = router.match(path, 'IO');
                const layer = matched.pathAndMethod[matched.pathAndMethod.length - 1];
                const captures = layer.captures(path);
                const params = layer.params(path, captures);
                const action = layer.stack[layer.stack.length - 1];

                const emit = data => {
                    socket.emit('update', {
                        path,
                        data
                    });
                };

                action({
                    method: 'io',
                    params,
                    socket,
                    emit,
                    disconnect: addDisconnectCallback
                });
            });
        });
    }
};

exports.default = Stream;