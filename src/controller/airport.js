import * as airport from '../service/airport';

export const departuresIndex = async ctx => {
    try {
        ctx.body = await airport.departures();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const arrivalsIndex = async ctx => {
    try {
        ctx.body = await airport.arrivals();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
