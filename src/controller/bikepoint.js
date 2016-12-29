import * as bikepoint from '../service/bikepoint';

export const index = async ctx => {
    ctx.body = await bikepoint.all();
};

export const get = async ctx => {
    ctx.body = await bikepoint.get(ctx.params.bikePoint);
};

export const around = async ctx => {
    ctx.body = await bikepoint.around(
        parseFloat(ctx.params.lon),
        parseFloat(ctx.params.lat),
        ctx.params.radius
    );
};
