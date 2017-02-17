import * as airquality from '../../service/weather/airquality';
import config          from '../../config';
import {redis}         from '../../redis';

const STREAM_CLIENTS_KEY = config('NAME_VERSION', true) + '_stream_clients_weather_airquality';

export const index = async ctx => {
    try {
        ctx.body = await airquality.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const get = async ctx => {
    try {
        ctx.body = await airquality.get(ctx.params.weatherStation);
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const fireHose = async ({ emit, disconnect }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = airquality.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};

export const streamSingle = async ({ emit, disconnect, params }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = airquality.streamSingle(params.weatherStation, data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};
