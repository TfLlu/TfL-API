import * as velok from '../sources/bikepoint/velok';
import * as veloh from '../sources/bikepoint/veloh';

export const index = async ctx => {

    ctx.body = {
        'velok': await velok.stations(),
        'veloh': await veloh.stations()
    };
};
