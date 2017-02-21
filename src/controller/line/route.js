import * as route from '../../service/line/route';

export const index = async ctx => {
    try {
        ctx.body = await route.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const byLine = async ctx => {
    try {
        ctx.body = await route.get(ctx.params.line);
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
