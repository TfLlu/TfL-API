//import * as velok from '../source/bikepoint/velok';
//import * as veloh from '../source/bikepoint/veloh';
import * as bikepoint from '../service/bikepoint';

export const index = async ctx => {

    ctx.body = await bikepoint.stations();

    /*ctx.body = {
        'velok': await velok.stations(),
        'veloh': await veloh.stations()
    };*/
};
