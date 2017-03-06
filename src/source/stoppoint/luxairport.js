import { luxairportDepartures } from '../../requests';

export const departures = async () => {
    var raw = await luxairportDepartures();
    return raw;
};
