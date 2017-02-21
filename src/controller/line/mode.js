import * as mode from '../../service/line/mode';

export const get = async ctx => {
    try {
        ctx.body = await mode.get(ctx.params.mode);
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const getRoutes = async ctx => {
    try {
        ctx.body = await mode.getRoutes(ctx.params.mode);
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
