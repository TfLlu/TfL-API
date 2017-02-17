import * as bikepoint from '../service/bikepoint';
import config         from '../config';
import {redis}        from '../redis';

const STREAM_CLIENTS_KEY = config('NAME_VERSION', true) + '_stream_clients_bikepoint';

export const index = async ctx => {
    try {
        ctx.body = await bikepoint.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const fireHose = async ({ emit, disconnect }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = bikepoint.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};

export const streamSingle = async ({ emit, disconnect, params }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = bikepoint.streamSingle(params.bikePoint, data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
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
