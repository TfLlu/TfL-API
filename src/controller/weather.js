import * as weather from '../service/weather';
import config       from '../config';
import {redis}      from '../redis';

const STREAM_CLIENTS_KEY = config('NAME_VERSION', true) + '_stream_clients_weather';

export const current = async ctx => {
    try {
        ctx.body = await weather.current();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const streamSingle = async ({ emit, disconnect }) => {
    console.log('hellow');
    redis.incr(STREAM_CLIENTS_KEY);
    var res = weather.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};
