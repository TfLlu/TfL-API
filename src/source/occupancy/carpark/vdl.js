import request from 'request-promise-native';
import xmlParser from '../../../helper/xmlParser';

const getRaw = () => request('http://service.vdl.lu/rss/circulation_guidageparking.php');

export const get = async () => {
    var raw = await getRaw();
    var data = await xmlParser(raw);

    return data['rss']['channel']['item'];
};

export const items = async () => {
    var items = await get();
    return items.map(compileParking);
};

export const compileParking = parking => {
    //return parking;
    var trend;
    switch(parseInt(parking['vdlxml:tendance'])) {
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

    return {
        id:                     parseInt(parking.id),
        name:                   parking.title,
        open:                   parseInt(parking['vdlxml:ouvert']) == 1,
        elevator:               parseInt(parking['vdlxml:divers']['vdlxml:diversAscenseur']) == 1,
        trend:                  trend,
        link:                   parking.guid,
        address: {
            latitude:           parseFloat(parking['vdlxml:localisation']['vdlxml:localisationLatitude']),
            longitude:          parseFloat(parking['vdlxml:localisation']['vdlxml:localisationLongitude']),
            entry:              parking['vdlxml:localisation']['vdlxml:localisationEntree'],
            exit:               parking['vdlxml:localisation']['vdlxml:localisationSortie']
        },
        phone:                  parseInt(parking['vdlxml:divers']['vdlxml:diversTelephone'].replace(/ /g,'')),
        lots:                   parseInt(parking['vdlxml:total']),
        available_lots:         parseInt(parking['vdlxml:actuel']),
        reserved_for_disabled:  parseInt(parking['vdlxml:nominal']['vdlxml:nominalHandicapes']),
        reserved_for_women:     parseInt(parking['vdlxml:nominal']['vdlxml:nominalFemmes']),
        motorbike_lots:         parseInt(parking['vdlxml:nominal']['vdlxml:nominalMotos']),
        bus_lots:               parseInt(parking['vdlxml:nominal']['vdlxml:nominalAutocars']),
        bicycle_docks:          parseInt(parking['vdlxml:nominal']['vdlxml:nominalVelos']),
        payment_methods: {
            cash:               parseInt(parking['vdlxml:paiement']['vdlxml:paiementEspeces']) == 1,
            vpay:               parseInt(parking['vdlxml:paiement']['vdlxml:paiementMaestro']) == 1,
            visa:               parseInt(parking['vdlxml:paiement']['vdlxml:paiementVisa']) == 1,
            mastercard:         parseInt(parking['vdlxml:paiement']['vdlxml:paiementMastercard']) == 1,
            eurocard:           parseInt(parking['vdlxml:paiement']['vdlxml:paiementEurocard']) == 1,
            amex:               parseInt(parking['vdlxml:paiement']['vdlxml:paiementAmex']) == 1,
            call2park:          parseInt(parking['vdlxml:paiement']['vdlxml:paiementCall2park']) == 1
        },
        restrictions: {
            allowed_gpl:        parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNoGpl']) == 1,
            allowed_trailor:    parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNoRemorque']) == 1,
            allowed_truck:      parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNo3t5']) == 1,
            max_height:         parseFloat(parking['vdlxml:restrictions']['vdlxml:restrictionsMaxHauteur'])
        }
    };
};
