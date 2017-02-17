import * as stoppoint from '../service/stoppoint';

export const index = async ctx => {
    try {
        ctx.body = await stoppoint.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const streamIndex = async ({ emit, disconnect }) => {
    var res = stoppoint.stream(data => {
        emit(data);
    });

    disconnect(() => {
        res.off();
    });
};

export const get = async ctx => {
    try {
        ctx.body = await stoppoint.get(
            parseInt(ctx.params.stopPoint)
        );
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const around = async ctx => {
    try {
        ctx.body = await stoppoint.around(
            parseFloat(ctx.params.lon),
            parseFloat(ctx.params.lat),
            ctx.params.radius
        );
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const box = async ctx => {
    try {
        ctx.body = await stoppoint.box(
            parseFloat(ctx.params.swlon),
            parseFloat(ctx.params.swlat),
            parseFloat(ctx.params.nelon),
            parseFloat(ctx.params.nelat)
        );
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const search = async ctx => {
    try {
        ctx.body = await stoppoint.search(
            ctx.params.searchstring.toLowerCase()
        );
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
