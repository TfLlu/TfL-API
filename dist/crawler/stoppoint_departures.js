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
const CRAWL_AMOUNT = (0, _config2.default)('CRAWL_TTL_STOPPOINT_DEPARTURE_AMOUNT', true);
const PUB_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_stoppoint_departures_';
const CACHE_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_stoppoint_departures';
const CACHE_STOPPOINTS_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_stoppoint';
const MAX_CONCURRENT_CRAWLS = (0, _config2.default)('CRAWL_MAX_CONCURRENT_STOPPOINT_DEPARTURE', true);

var newData = [];
var cache = {};
var JobsToAdd;
var stopPointsToCrawl = [];
var currentlyCrawling = [];

const worker = (() => {
    var _ref = _asyncToGenerator(function* () {
        try {
            var stopPointID = stopPointsToCrawl.shift();
            currentlyCrawling.push(stopPointID);
            yield departures.get(stopPointID, CRAWL_AMOUNT).then(function (departures) {
                removeFromCrawlList(stopPointID);

                if (!cache[stopPointID]) {
                    cache[stopPointID] = departures;
                    _redis.redis.set(CACHE_TABLE, JSON.stringify(cache), 'EX', CACHE_TTL);
                    if (process.env.TRAVIS) {
                        process.exit();
                    }
                    return;
                }
                newData = departures;

                var data = {
                    stopPoint: stopPointID,
                    new: null,
                    update: null,
                    delete: null
                };

                // update
                var updatedDepartures = cache[stopPointID].filter(function (row) {
                    var oldRow = newData.find(function (row2) {
                        return row2.id === row.id;
                    });
                    return oldRow && JSON.stringify(row) != JSON.stringify(oldRow);
                });
                if (updatedDepartures.length) {
                    data.update = updatedDepartures;
                }

                // new
                var newDepartures = newData.filter(function (row) {
                    return !cache[stopPointID].find(function (row2) {
                        return row2.id === row.id;
                    });
                });
                if (newDepartures.length) {
                    data.new = newDepartures;
                }

                // deleted
                var deletedDepartures = cache[stopPointID].filter(function (row) {
                    return !newData.find(function (row2) {
                        return row2.id === row.id;
                    });
                });
                if (deletedDepartures.length) {
                    data.delete = deletedDepartures;
                }

                if (data.update || data.new || data.delete) {
                    _redis.redis.publish(PUB_TABLE + stopPointID, JSON.stringify(data));
                }

                cache[stopPointID] = newData;
                _redis.redis.set(CACHE_TABLE, JSON.stringify(cache), 'EX', CACHE_TTL);
            }, function (err) {
                removeFromCrawlList(stopPointID);
            });
        } catch (err) {
            removeFromCrawlList(stopPointID);
        }
    });

    return function worker() {
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
        var startTime = new Date().getTime();
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

        stopPointsToCrawl = stopPointsToCrawl.slice(0, 100);

        while (stopPointsToCrawl.length !== 0) {
            if (stopPointsToCrawl.length > MAX_CONCURRENT_CRAWLS) {
                JobsToAdd = MAX_CONCURRENT_CRAWLS - currentlyCrawling.length;
            } else {
                JobsToAdd = stopPointsToCrawl.length - currentlyCrawling.length;
            }
            if (JobsToAdd <= 0) {
                yield sleep(100);
                continue;
            }
            for (var i = 1; i <= JobsToAdd; i++) {
                worker();
            }
            yield sleep(100);
            continue;
        }

        var diffTime = new Date().getTime() - startTime;
        var timeOut = CRAWL_TTL - diffTime < 0 ? 0 : CRAWL_TTL - diffTime;
        setTimeout(crawl, timeOut);
    });

    return function crawl() {
        return _ref2.apply(this, arguments);
    };
})();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Run crawler
crawl();