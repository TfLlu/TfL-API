import * as bikepoint from '../service/bikepoint';

export const index = async ctx => {

    ctx.body = await bikepoint.stations();
};
