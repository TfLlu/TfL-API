import IO from 'socket.io';
import KoaRouter from 'koa-router';

KoaRouter.prototype.io = function (name, path, middleware) {
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
        const io = IO(server, {
            path: '/stream'
        });
        io.on('connection', socket => {
            const disconnectCallbacks = [];
            const addDisconnectCallback = callback => disconnectCallbacks.push(callback);
            const disconnect = function() {
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
                    socket.emit('data', {
                        path,
                        data
                    });
                };

                action({
                    method: 'io',
                    io,
                    path,
                    params,
                    socket,
                    emit,
                    disconnect: addDisconnectCallback
                });
            });
        });
    }
};

export default Stream;
