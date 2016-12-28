import * as weather from '../service/weather';

export const current = async ctx => {
    ctx.body = await weather.current();
};
