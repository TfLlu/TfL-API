import request   from '../../../request';
import xmlParser from '../../../helper/xmlParser';

const getRaw = async () => (await request('http://service.vdl.lu/rss/circulation_guidageparking.php')).data;

export const loadCarParks = async () => {
    var raw = await getRaw();
    var data = await xmlParser(raw);

    return data['rss']['channel']['item'];
};

export const all = async () => {
    var carParks = await loadCarParks();
    return carParks.map(compileParking);
};

export const get = async carPark => {
    var carParks = await loadCarParks();
    carParks = carParks.map(compileParking);
    for (var i = 0; i < carParks.length; i++) {
        if (carParks[i].properties.id == carPark) {
            return carParks[i];
        }
    }
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

    var id = parseInt(parking.id);
    if (isNaN(id)) {
        id = /id=(\d+)/g.exec(parking.guid)[1];
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
                parseFloat(parking['vdlxml:localisation']['vdlxml:localisationLongitude']),
                parseFloat(parking['vdlxml:localisation']['vdlxml:localisationLatitude'])
            ]
        },
        properties: {
            id:            id,
            name:          parking.title,
            total:         parseInt(parking['vdlxml:total']),
            free:          parseInt(parking['vdlxml:actuel']),
            trend:         trend,
            meta: {
                open:                  parseInt(parking['vdlxml:ouvert']) == 1,
                elevator:              parseInt(parking['vdlxml:divers']['vdlxml:diversAscenseur']) == 1,
                link:                  parking.guid,
                address: {
                    street:            parking['vdlxml:localisation']['vdlxml:localisationEntree'],
                    exit:              parking['vdlxml:localisation']['vdlxml:localisationSortie']
                },
                phone:                 parseInt(parking['vdlxml:divers']['vdlxml:diversTelephone'].replace(/ /g,'')),
                reserved_for_disabled: parseInt(parking['vdlxml:nominal']['vdlxml:nominalHandicapes']),
                reserved_for_women:    parseInt(parking['vdlxml:nominal']['vdlxml:nominalFemmes']),
                motorbike_lots:        parseInt(parking['vdlxml:nominal']['vdlxml:nominalMotos']),
                bus_lots:              parseInt(parking['vdlxml:nominal']['vdlxml:nominalAutocars']),
                bicycle_docks:         parseInt(parking['vdlxml:nominal']['vdlxml:nominalVelos']),
                payment_methods: {
                    cash:              parseInt(parking['vdlxml:paiement']['vdlxml:paiementEspeces']) == 1,
                    vpay:              parseInt(parking['vdlxml:paiement']['vdlxml:paiementMaestro']) == 1,
                    visa:              parseInt(parking['vdlxml:paiement']['vdlxml:paiementVisa']) == 1,
                    mastercard:        parseInt(parking['vdlxml:paiement']['vdlxml:paiementMastercard']) == 1,
                    eurocard:          parseInt(parking['vdlxml:paiement']['vdlxml:paiementEurocard']) == 1,
                    amex:              parseInt(parking['vdlxml:paiement']['vdlxml:paiementAmex']) == 1,
                    call2park:         parseInt(parking['vdlxml:paiement']['vdlxml:paiementCall2park']) == 1
                },
                restrictions: {
                    allowed_gpl:       parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNoGpl']) == 1,
                    allowed_trailor:   parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNoRemorque']) == 1,
                    allowed_truck:     parseInt(parking['vdlxml:restrictions']['vdlxml:restrictionsNo3t5']) == 1,
                    max_height:        parseFloat(parking['vdlxml:restrictions']['vdlxml:restrictionsMaxHauteur'])
                }
            }
        }
    };
};
