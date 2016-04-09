var departures = require('../departures.js'),
    md5 = require('md5');

var listeners = {};
var idList = [];

var prepareResult = function(result) {
    var deps = {};
    for (var i = 0; i < result.length; i++) {
        var id = md5(result[i].line + '-' + result[i].number + '-' + result[i].destination);
        if (!deps[id]) {
            deps[id] = result[i];
        }
    }
    return deps;
};

var handleTick = function() {
    if (!idList.length) {
        setTimeout(handleTick, 500);
        return;
    }
    var id = idList.shift();
    idList.push(id);
    departures.list(id)
        .then(function(result) {
            var deps = prepareResult(result);
            for (var reqId in listeners[id]) {
                var data = {};
                var send = false;

                // find new and updates
                for (var depId in deps) {
                    if (!listeners[id][reqId].departures[depId]) {
                        data[depId] = Object.assign({
                            event: 'new'
                        }, deps[depId]);
                        var send = true;
                    } else if (deps[depId].departure != listeners[id][reqId].departures[depId].departure) {
                        data[depId] = Object.assign({
                            event: 'update'
                        }, deps[depId]);
                        var send = true;
                    }
                }

                // find deletes
                for (var depId in listeners[id][reqId].departures) {
                    if (!deps[depId]) {
                        data[depId] = Object.assign({
                            event: 'delete'
                        }, deps[depId]);
                        var send = true;
                    }
                }

                if (send) {
                    sails.sockets.broadcast(reqId, 'update', data);
                }
                listeners[id][reqId].departures = deps;
            }
        })
        .fin(function() {
            setTimeout(handleTick, 500);
        });
};
handleTick();


module.exports = {

    add: function(id, req) {
        if (!listeners[id]) {
            listeners[id] = {};
            idList.push(id);
        }
        listeners[id][sails.sockets.getId(req)] = {
            req: req,
            departures: {}
        };
        sails.sockets.join(req, id);
    }

};
