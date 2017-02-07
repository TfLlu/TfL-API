import * as weather from '../service/weather';

export const current = async ctx => {
    try {
        ctx.body = await weather.current();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
