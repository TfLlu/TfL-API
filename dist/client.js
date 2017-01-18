'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Client {
    constructor(host) {
        this.host = host || 'https://api.tfl.lu/latest';
        this.subscriptions = {};
        this.io = (0, _socket2.default)(this.host, {
            path: '/stream'
        });
        this.io.on('update', update => {
            if (!update.path || !this.subscriptions[update.path]) {
                return;
            }
            this.subscriptions[update.path].forEach(callback => callback(update.data || {}));
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

exports.default = Client;