import * as velok from '../source/bikepoint/velok';
import * as veloh from '../source/bikepoint/veloh';

export const index = async ctx => {

    ctx.body = {
        'velok': await velok.stations(),
        'veloh': await veloh.stations()
    };
};
