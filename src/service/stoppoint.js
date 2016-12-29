import * as mobiliteit from '../source/stoppoint/mobiliteit';

export const all = async () => {
    return await mobiliteit.all();
};

export const get = async stopPoint => {
    return await mobiliteit.get(stopPoint);
};

export const around = async (lon, lat, radius) => {
    return await mobiliteit.around(lon, lat, radius);
};
