import * as mobiliteit from '../source/stoppoint/mobiliteit';

export const points = async () => {
    const points = await mobiliteit.points();
    return points;
};

export const point = async point => {
    point = point.split(':');
    return await mobiliteit.station(point[1]);
};

export const compilePoint = function(provider, point) {
    point.id = provider + ':' + point.id;
    return point;
};
