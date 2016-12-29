import * as bikepoint from '../service/bikepoint';

export const index = async ctx => {
    ctx.body = await bikepoint.all();
};

export const get = async ctx => {
    ctx.body = await bikepoint.get(ctx.params.bikePoint);
};
