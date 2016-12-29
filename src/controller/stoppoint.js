import * as stoppoint from '../service/stoppoint';

export const index = async ctx => {
    ctx.body = await stoppoint.all();
};

export const show = async ctx => {
    ctx.body = await stoppoint.get(ctx.params.stopPoint);
};

export const around = async ctx => {
    ctx.body = await stoppoint.around(
        parseFloat(ctx.params.lon),
        parseFloat(ctx.params.lat),
        ctx.params.radius
    );
};
