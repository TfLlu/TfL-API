'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compileParking = exports.items = exports.get = undefined;

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _xmlParser = require('../../../helper/xmlParser');

var _xmlParser2 = _interopRequireDefault(_xmlParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getRaw = () => (0, _requestPromiseNative2.default)('http://service.vdl.lu/rss/circulation_guidageparking.php');

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* () {
        var raw = yield getRaw();
        var data = yield (0, _xmlParser2.default)(raw);

        return data['rss']['channel']['item'];
    });

    return function get() {
        return _ref.apply(this, arguments);
    };
})();

const items = exports.items = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var items = yield get();
        return items.map(compileParking);
    });

    return function items() {
        return _ref2.apply(this, arguments);
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
        id: id,
        name: parking.title,
        open: parseInt(parking['vdlxml:ouvert']) == 1,
        elevator: parseInt(parking['vdlxml:divers']['vdlxml:diversAscenseur']) == 1,
        trend: trend,
        link: parking.guid,
        address: {
            latitude: parseFloat(parking['vdlxml:localisation']['vdlxml:localisationLatitude']),
            longitude: parseFloat(parking['vdlxml:localisation']['vdlxml:localisationLongitude']),
            entry: parking['vdlxml:localisation']['vdlxml:localisationEntree'],
            exit: parking['vdlxml:localisation']['vdlxml:localisationSortie']
        },
        phone: parseInt(parking['vdlxml:divers']['vdlxml:diversTelephone'].replace(/ /g, '')),
        lots: parseInt(parking['vdlxml:total']),
        available_lots: parseInt(parking['vdlxml:actuel']),
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
    };
};