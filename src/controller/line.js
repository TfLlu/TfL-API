import * as line from '../service/line';

export const index = async ctx => {
    try {
        ctx.body = await line.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const get = async ctx => {
    try {
        ctx.body = await line.get(ctx.params.line);
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
