import * as bikepoint from '../service/bikepoint';

var streamClients = 0;

export const index = async ctx => {
    try {
        ctx.body = await bikepoint.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const streamCount = () => streamClients;

export const streamIndex = async ({ emit, disconnect }) => {
    streamClients++;
    var res = bikepoint.stream(data => {
        emit(data);
    });

    disconnect(() => {
        streamClients--;
        res.off();
    });
};

export const get = async ctx => {
    try {
        ctx.body = await bikepoint.get(ctx.params.bikePoint);
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const around = async ctx => {
    try {
        ctx.body = await bikepoint.around(
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
        ctx.body = await bikepoint.box(
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
        ctx.body = await bikepoint.search(
            ctx.params.searchstring.toLowerCase()
        );
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
