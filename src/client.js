import IO from 'socket.io-client';

class Client {
    constructor(host) {
        this.host = host || 'https://api.tfl.lu/latest';
        this.subscriptions = {};
        this.io = IO(this.host, {
            path: '/stream'
        });
        this.io.on('data', data => {
            if (!data.path || !this.subscriptions[data.path]) {
                return;
            }
            this.subscriptions[data.path].forEach(callback => callback(data.data || {}));
        });
    }

    subscribe(path, callback) {
        if (!this.subscriptions[path]) {
            this.subscriptions[path] = [];
            this.io.emit('subscribe', path);
        }
        this.subscriptions[path].push(callback);
    }
}

export default Client;
