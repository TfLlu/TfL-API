import { veloh }  from '../../requests';

export const loadBikePoints = () => veloh();

export const all = async () => {
    var bikePoints = await loadBikePoints();
    return bikePoints.map(compileBikePoint);
};

export const get = async bikePointId => {
    var bikePoint = await loadBikePoints(bikePointId);
    return compileBikePoint(bikePoint);
};

export const compileBikePoint = bikePoint => {

    var dock_status = [];

    for (var i = 1; i <= bikePoint.available_bikes; i++) {
        dock_status.push({
            status:   'occupied',
            bikeType: 'manual'
        });
    }

    for (i = 1; i <= bikePoint.available_bike_stands; i++) {
        dock_status.push({
            status:   'free',
            bikeType: null
        });
    }

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
                parseFloat(bikePoint.position.lng),
                parseFloat(bikePoint.position.lat)
            ]
        },
        properties: {
            id: bikePoint.number,
            open: bikePoint.status == 'OPEN',
            name: bikePoint.name,
            city: null,
            address: bikePoint.address,
            photo: null,
            docks: parseInt(bikePoint.bike_stands),
            available_bikes: parseInt(bikePoint.available_bikes),
            available_ebikes: 0,
            available_docks: parseInt(bikePoint.available_bike_stands),
            last_update: bikePoint.last_update,
            dock_status: dock_status
        }
    };
};
