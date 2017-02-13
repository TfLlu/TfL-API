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
    var _ref = _asyncToGenerator(function* (retry) {
        retry = retry || 10;
        var stopPointID = stopPointsToCrawl.shift();
        currentlyCrawling.push(stopPointID);

        while (retry) {
            retry--;
            try {
                var newData = yield departures.load(stopPointID, CRAWL_AMOUNT);
                break;
            } catch (err) {
                if (!err.code) {
                    if (err.response) {
                        if (err.response.status) {
                            err.code = err.response.status;
                        }
                    }
                }
                if (err.code === 400) {
                    removeFromCrawlList(stopPointID);
                    return;
                }
                if (retry === 0) {
                    removeFromCrawlList(stopPointID);
                    console.log('error', err.code, err.message);
                    return;
                }
            }
        }

        removeFromCrawlList(stopPointID);

        if (!cache[stopPointID]) {
            cache[stopPointID] = newData;
            yield _redis.redis.set(CACHE_TABLE + '_' + stopPointID, JSON.stringify(newData), 'EX', CACHE_TTL);
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
            yield _redis.redis.publish(PUB_TABLE + stopPointID, JSON.stringify({
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
            yield _redis.redis.publish(PUB_TABLE + stopPointID, JSON.stringify({
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
            yield _redis.redis.publish(PUB_TABLE + stopPointID, JSON.stringify({
                type: 'new',
                data: {
                    [stopPointID]: newDepartures
                }
            }));
        }

        cache[stopPointID] = newData;
        yield _redis.redis.set(CACHE_TABLE + '_' + stopPointID, JSON.stringify(newData), 'EX', CACHE_TTL);
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
                worker();
            }
            yield sleep();
        }
        if (process.env.TRAVIS) {
            process.exit();
        }

        yield _redis.redis.set(CACHE_TABLE, JSON.stringify(cache), 'EX', CACHE_TTL);

        setTimeout(crawl);
    });

    return function crawl() {
        return _ref2.apply(this, arguments);
    };
})();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Run crawler
crawl();