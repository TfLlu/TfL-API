import * as stoppoint from '../service/stoppoint';

export const index = async ctx => {
    ctx.body = await stoppoint.all();
};

export const show = async ctx => {
    var result = await stoppoint.get(ctx.params.stopPoint);
    if (result) {
        ctx.body = result;
    }
};
