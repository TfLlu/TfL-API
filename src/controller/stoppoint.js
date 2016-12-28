import * as stoppoint from '../service/stoppoint';

export const index = async ctx => {
    ctx.body = await stoppoint.points();
};

export const show = async ctx => {
    ctx.body = await stoppoint.point(ctx.params.stopPoint);
};
