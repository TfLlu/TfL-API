import * as mobiliteit from '../source/stoppoint/mobiliteit';

export const all = async () => {
    return await mobiliteit.all();
};

export const get = async stopPoint => {
    return await mobiliteit.get(stopPoint);
};

export const compilePoint = function(provider, point) {
    point.id = provider + ':' + point.id;
    return point;
};
