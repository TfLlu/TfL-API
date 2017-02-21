import * as lines from '../service/lines';
//import config       from '../config';
//import {redis}      from '../redis';

//const STREAM_CLIENTS_KEY = config('NAME_VERSION', true) + '_stream_clients_highway';

export const index = async ctx => {
    try {
        ctx.body = await lines.load();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const get = async ctx => {
    try {
        ctx.body = await lines.get(ctx.params.line);
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};
/*
export const fireHose = async ({ emit, disconnect }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = highway.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};

export const streamSingle = async ({ emit, disconnect, params }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = highway.streamSingle(params.highway, data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};
*/
