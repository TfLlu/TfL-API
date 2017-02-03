'use strict';

var _departures = require('../service/stoppoint/departures');

var departures = _interopRequireWildcard(_departures);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CACHE_TTL = (0, _config2.default)('CACHE_TTL_STOPPOINT_DEPARTURE', true);
const CRAWL_TTL = (0, _config2.default)('CRAWL_TTL_STOPPOINT_DEPARTURE', true);
const CRAWL_AMOUNT = (0, _config2.default)('CRAWL_STOPPOINT_DEPARTURE_AMOUNT', true);
const PUB_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_stoppoint_departures_';
const CACHE_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_stoppoint_departures';
const CACHE_STOPPOINTS_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_stoppoint';
const MAX_CONCURRENT_CRAWLS = (0, _config2.default)('CRAWL_MAX_CONCURRENT_STOPPOINT_DEPARTURE', true);

var cache = {};
var JobsToAdd;
var stopPointsToCrawl = [];
var currentlyCrawling = [];

const worker = (() => {
    var _ref = _asyncToGenerator(function* (count) {
        var stopPointID = stopPointsToCrawl.shift();
        currentlyCrawling.push(stopPointID);

        while (count) {
            count--;
            try {

                try {

                    var newData = yield departures.get(stopPointID, CRAWL_AMOUNT);

                    removeFromCrawlList(stopPointID);

                    if (!cache[stopPointID]) {
                        cache[stopPointID] = newData;
                        _redis.redis.set(CACHE_TABLE, JSON.stringify(cache), 'EX', CACHE_TTL);
                        if (process.env.TRAVIS) {
                            process.exit();
                        }
                        return;
                    }

                    // update
                    var updatedDepartures = cache[stopPointID].filter(function (row) {
                        var oldRow = newData.find(function (row2) {
                            return row2.id === row.id;
                        });
                        return oldRow && JSON.stringify(row) != JSON.stringify(oldRow);
                    });
                    if (updatedDepartures.length) {
                        _redis.redis.publish(PUB_TABLE + stopPointID, JSON.stringify({
                            type: 'update',
                            data: {
                                [stopPointID]: updatedDepartures
                            }
                        }));
                    }

                    // deleted
                    var deletedDepartures = cache[stopPointID].filter(function (row) {
                        return !newData.find(function (row2) {
                            return row2.id === row.id;
                        });
                    });
                    if (deletedDepartures.length) {
                        _redis.redis.publish(PUB_TABLE + stopPointID, JSON.stringify({
                            type: 'delete',
                            data: {
                                [stopPointID]: deletedDepartures
                            }
                        }));
                    }

                    // new
                    var newDepartures = newData.filter(function (row) {
                        return !cache[stopPointID].find(function (row2) {
                            return row2.id === row.id;
                        });
                    });
                    if (newDepartures.length) {
                        _redis.redis.publish(PUB_TABLE + stopPointID, JSON.stringify({
                            type: 'new',
                            data: {
                                [stopPointID]: newDepartures
                            }
                        }));
                    }

                    cache[stopPointID] = newData;
                    _redis.redis.set(CACHE_TABLE, JSON.stringify(cache), 'EX', CACHE_TTL);
                } catch (err) {
                    removeFromCrawlList(stopPointID);
                    var code = 'UNKNOWN';
                    if (err.code) {
                        code = err.code;
                    } else {
                        if (err.response) {
                            if (err.response.status) {
                                code = err.response.status;
                            }
                        }
                    }
                    err.code = code;
                    throw err;
                }
            } catch (err) {
                if (err.code === 400) {
                    return;
                }
                if (count === 0) {
                    console.log('error', err.code, err.message, currentlyCrawling.length);
                    console.log(err.config.url);
                }
            }
        }
    });

    return function worker(_x) {
        return _ref.apply(this, arguments);
    };
})();

const removeFromCrawlList = id => {
    var index = currentlyCrawling.indexOf(id);
    if (index > -1) {
        currentlyCrawling.splice(index, 1);
    }
};

const crawl = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        //var startTime = new Date().getTime();
        var result = yield _redis.redis.get(CACHE_STOPPOINTS_TABLE);
        if (result && result !== '') {
            stopPointsToCrawl = JSON.parse(result).features;
        } else {
            setTimeout(crawl, CRAWL_TTL);
            return;
        }

        stopPointsToCrawl = stopPointsToCrawl.map(function (item) {
            return item.properties.id;
        });

        while (stopPointsToCrawl.length !== 0) {
            JobsToAdd = Math.min(MAX_CONCURRENT_CRAWLS, stopPointsToCrawl.length) - currentlyCrawling.length;

            if (JobsToAdd <= 0) {
                yield sleep();
                continue;
            }
            for (var i = 1; i <= JobsToAdd; i++) {
                worker(10);
            }
            yield sleep();
        }

        //var diffTime = new Date().getTime() - startTime;
        //var timeOut = CRAWL_TTL - diffTime < 0 ? 0 : CRAWL_TTL - diffTime;
        //setTimeout(crawl, timeOut);
        //setTimeout(crawl);
        process.exit();
    });

    return function crawl() {
        return _ref2.apply(this, arguments);
    };
})();

setInterval(function () {
    console.log('queue', stopPointsToCrawl.length);
}, 5000);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Run crawler
crawl();