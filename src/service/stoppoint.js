import * as mobiliteit from '../source/stoppoint/mobiliteit';
var cron = require('node-cron');

var stoppoints = false;

cron.schedule('* 15 6 * *', function(){
    getStoppoints();
});

const getStoppoints = async () => {
    console.log('refreshing mobiliteit');
    stoppoints = await mobiliteit.points();
};

export const points = async () => {
    if (!stoppoints) {
        await getStoppoints();
    }
    return stoppoints;
};

export const point = async point => {
    return await mobiliteit.station(point);
};

export const compilePoint = function(provider, point) {
    point.id = provider + ':' + point.id;
    return point;
};
