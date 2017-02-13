'use strict';

var _carpark = require('../service/occupancy/carpark');

var carpark = _interopRequireWildcard(_carpark);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _redis = require('../redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var newData = [];
var cache;

const CACHE_TTL = (0, _config2.default)('CACHE_TTL_CARPARK', true);
const CRAWL_TTL = (0, _config2.default)('CRAWL_TTL_CARPARK', true);
const PUB_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_occupancy_carpark';
const CACHE_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_occupancy_carpark';

const crawl = (() => {
    var _ref = _asyncToGenerator(function* () {
        var startTime = new Date().getTime();
        if (!cache) {
            try {
                cache = yield carpark.load();
            } catch (err) {
                setTimeout(crawl, CRAWL_TTL);
                return;
            }
            yield _redis.redis.set(CACHE_TABLE, JSON.stringify(cache), 'EX', CACHE_TTL);
            if (process.env.TRAVIS) {
                process.exit();
            }
            setTimeout(crawl, CRAWL_TTL);
            return;
        }
        newData = yield carpark.load();

        // update
        var updatedCarparks = cache.features.filter(function (row) {
            var oldRow = newData.features.find(function (row2) {
                return row2.properties.id === row.properties.id;
            });
            return oldRow && JSON.stringify(row) != JSON.stringify(oldRow);
        });

        // update
        if (updatedCarparks.length) {
            _redis.redis.publish(PUB_TABLE, JSON.stringify({
                type: 'update',
                data: updatedCarparks.map(carpark.compileStream)
            }));
        }

        // new
        var newCarparks = newData.features.filter(function (row) {
            return !cache.features.find(function (row2) {
                return row2.properties.id === row.properties.id;
            });
        });

        if (newCarparks.length) {
            _redis.redis.publish(PUB_TABLE, JSON.stringify({
                type: 'new',
                data: newCarparks.map(carpark.compileStream)
            }));
        }

        // deleted
        var deletedCarparks = cache.features.filter(function (row) {
            return !newData.features.find(function (row2) {
                return row2.properties.id === row.properties.id;
            });
        });
        if (deletedCarparks.length) {
            _redis.redis.publish(PUB_TABLE, JSON.stringify({
                type: 'delete',
                data: deletedCarparks.map(carpark.compileStream)
            }));
        }

        cache = newData;

        yield _redis.redis.set(CACHE_TABLE, JSON.stringify(cache), 'EX', CACHE_TTL);

        var diffTime = new Date().getTime() - startTime;
        var timeOut = CRAWL_TTL - diffTime < 0 ? 0 : CRAWL_TTL - diffTime;
        setTimeout(crawl, timeOut);
    });

    return function crawl() {
        return _ref.apply(this, arguments);
    };
})();

// Run crawler
crawl();