import * as journey from '../service/journey';

export const plan = async ctx => {
    try {
        ctx.type = 'json';
        ctx.body = await journey.plan(ctx.params.from, ctx.params.to);
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
