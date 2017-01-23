'use strict';

var _bikepoint = require('../service/bikepoint');

var bikepoint = _interopRequireWildcard(_bikepoint);

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

const crawl = (() => {
    var _ref = _asyncToGenerator(function* () {
        var startTime = new Date().getTime();
        if (!cache) {
            cache = yield bikepoint.load();
            yield _redis.redis.set((0, _config2.default)('NAME_VERSION', true) + '_cache_bikepoint', JSON.stringify(cache), 'EX', (0, _config2.default)('CACHE_TTL', true));
            setTimeout(crawl, (0, _config2.default)('CRAWL_TTL_BIKEPOINT', true));
            return;
        }
        newData = yield bikepoint.load();

        // update
        var updatedBikePoints = cache.features.filter(function (row) {
            var oldRow = newData.features.find(function (row2) {
                return row2.properties.id === row.properties.id;
            });
            var tmpRow = (0, _deepClone2.default)(row);
            delete tmpRow.properties.last_update;
            var tmpOldRow = (0, _deepClone2.default)(oldRow);
            delete tmpOldRow.properties.last_update;

            return oldRow && JSON.stringify(tmpRow) != JSON.stringify(tmpOldRow);
        });

        // update
        if (updatedBikePoints.length) {
            _redis.redis.publish((0, _config2.default)('NAME_VERSION', true) + '_bikepoint', JSON.stringify({
                type: 'update',
                data: updatedBikePoints.map(compileStream)
            }));
        }

        // new
        var newBikePoints = newData.features.filter(function (row) {
            return !cache.features.find(function (row2) {
                return row2.properties.id === row.properties.id;
            });
        });

        if (newBikePoints.length) {
            _redis.redis.publish((0, _config2.default)('NAME_VERSION', true) + '_bikepoint', JSON.stringify({
                type: 'new',
                data: newBikePoints.map(compileStream)
            }));
        }

        // deleted
        var deletedBikePoints = cache.features.filter(function (row) {
            return !newData.features.find(function (row2) {
                return row2.properties.id === row.properties.id;
            });
        });
        if (deletedBikePoints.length) {
            _redis.redis.publish((0, _config2.default)('NAME_VERSION', true) + '_bikepoint', JSON.stringify({
                type: 'delete',
                data: deletedBikePoints.map(compileStream)
            }));
        }

        cache = newData;

        yield _redis.redis.set((0, _config2.default)('NAME_VERSION', true) + '_cache_bikepoint', JSON.stringify(cache));

        var diffTime = new Date().getTime() - startTime;
        var timeOut = (0, _config2.default)('CRAWL_TTL_BIKEPOINT', true) - diffTime < 0 ? 0 : (0, _config2.default)('CRAWL_TTL_BIKEPOINT', true) - diffTime;
        setTimeout(crawl, timeOut);
    });

    return function crawl() {
        return _ref.apply(this, arguments);
    };
})();

const compileStream = bikePoint => {
    return {
        id: bikePoint.properties.id,
        data: bikePoint
    };
};

// Run crawler
crawl();