'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileParking = exports.get = exports.all = exports.loadCarParks = undefined;

var _request = require('../../../request');

var _request2 = _interopRequireDefault(_request);

var _xmlParser = require('../../../helper/xmlParser');

var _xmlParser2 = _interopRequireDefault(_xmlParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = (() => {
    var _ref = _asyncToGenerator(function* () {
        return (yield (0, _request2.default)('http://service.vdl.lu/rss/circulation_guidageparking.php')).data;
    });

    return function getRaw() {
        return _ref.apply(this, arguments);
    };
})();

const loadCarParks = exports.loadCarParks = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var raw = yield getRaw();
        var data = yield (0, _xmlParser2.default)(raw);

        return data['rss']['channel']['item'];
    });

    return function loadCarParks() {
        return _ref2.apply(this, arguments);
    };
})();

const all = exports.all = (() => {
    var _ref3 = _asyncToGenerator(function* () {
        var carParks = yield loadCarParks();
        return carParks.map(compileParking);
    });

    return function all() {
        return _ref3.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref4 = _asyncToGenerator(function* (carPark) {
        var carParks = yield loadCarParks();
        carParks = carParks.map(compileParking);
        for (var i = 0; i < carParks.length; i++) {
            if (carParks[i].properties.id == carPark) {
                return carParks[i];
            }
        }
    });

    return function get(_x) {
        return _ref4.apply(this, arguments);
    };
})();

const compileParking = exports.compileParking = parking => {
    //return parking;
    var trend;
    switch (parseInt(parking['vdlxml:tendance'])) {
        case -1:
            trend = 'down';
            break;
        case 0:
            trend = 'stable';
            break;
        case 1:
            trend = 'up';
            break;
        default:
            trend = null;
    }

    var id = parseInt(parking.id);
    if (isNaN(id)) {
        id = /id=(\d+)/g.exec(parking.guid)[1];
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [parseFloat(parking['vdlxml:localisation']['vdlxml:localisationLongitude']), parseFloat(parking['vdlxml:localisation']['vdlxml:localisationLatitude'])]
        },
        properties: {
            id: id,
            name: parking.title,
            total: parseInt(parking['vdlxml:total']),
            free: parseInt(parking['vdlxml:actuel']),
            trend: trend,
            meta: {
                open: parseInt(parking['vdlxml:ouvert']) == 1,
                elevator: parseInt(parking['vdlxml:divers']['vdlxml:diversAscenseur']) == 1,
                link: parking.guid,
                address: {
                    street: parking['vdlxml:localisation']['vdlxml:localisationEntree'],
                    exit: parking['vdlxml:localisation']['vdlxml:localisationSortie']
                },
                phone: parseInt(parking['vdlxml:divers']['vdlxml:diversTelephone'].replace(/ /g, '')),
                reserved_for_disabled: parseInt(parking['vdlxml:nominal']['vdlxml:nominalHandicapes']),
                reserved_for_women: parseInt(parking['vdlxml:nominal']['vdlxml:nominalFemmes']),
                motorbike_lots: parseInt(parking['vdlxml:nominal']['vdlxml:nominalMotos']),
                bus_lots: parseInt(parking['vdlxml:nominal']['vdlxml:nominalAutocars']),
                bicycle_docks: parseInt(parking['vdlxml:nominal']['vdlxml:nominalVelos']),
                payment_methods: {
                    cash: parseInt(parking['vdlxml:paiement']['vdlxml:paiementEspeces']) == 1,
                    vpay: parseInt(parking['vdlxml:paiement']['vdlxml:paiementMaestro']) == 1,
                    visa: parseInt(parking['vdlxml:paiement']['vdlxml:paiementVisa']) == 1,
                    mastercard: parseInt(parking['vdlxml:paiement']['vdlxml:paiementMastercard']) == 1,
                    eurocard: parseInt(parking['vdlxml:paiement']['vdlxml:paiementEurocard']) == 1,
                    amex: parseInt(parking['vdlxml:paiement']['vdlxml:paiementAmex']) == 1,
                    call2park: parseInt(parking['vdlxml:paiement']['vdlxml:paiementCall2park']) == 1
                },
                restrictions: {
                    allowed_gpl: parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNoGpl']) == 1,
                    allowed_trailor: parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNoRemorque']) == 1,
                    allowed_truck: parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNo3t5']) == 1,
                    max_height: parseFloat(parking['vdlxml:restrictions']['vdlxml:restrictionsMaxHauteur'])
                }
            }
        }
    };
};