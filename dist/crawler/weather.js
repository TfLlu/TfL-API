'use strict';

var _weather = require('../service/weather');

var weather = _interopRequireWildcard(_weather);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _deepClone = require('deep-clone');

var _deepClone2 = _interopRequireDefault(_deepClone);

var _redis = require('../redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var newData = [];
var cache;

const CACHE_TTL = (0, _config2.default)('CACHE_TTL_WEATHER', true);
const CRAWL_TTL = (0, _config2.default)('CRAWL_TTL_WEATHER', true);
const PUB_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_weather';
const CACHE_TABLE = (0, _config2.default)('NAME_VERSION', true) + '_cache_weather';

const crawl = (() => {
    var _ref = _asyncToGenerator(function* () {
        var startTime = new Date().getTime();
        if (!cache) {
            try {
                cache = yield weather.load();
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
        newData = yield weather.load();

        // update
        var tmpCache = (0, _deepClone2.default)(cache);
        delete tmpCache.dt;
        var tmpNewData = (0, _deepClone2.default)(newData);
        delete tmpNewData.dt;
        if (JSON.stringify(tmpCache) != JSON.stringify(tmpNewData)) {
            _redis.redis.publish(PUB_TABLE, JSON.stringify({
                type: 'update',
                data: newData
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