import * as carpark from '../../service/occupancy/carpark';
import config       from '../../config';
import {redis}      from '../../redis';

const STREAM_CLIENTS_KEY = config('NAME_VERSION', true) + '_stream_clients_occupancy_carpark';

export const index = async ctx => {
    try {
        ctx.body = await carpark.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const fireHose = async ({ emit, disconnect }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = carpark.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};

export const get = async ctx => {
    try {
        ctx.body = await carpark.get(
            ctx.params.carPark
        );
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const streamSingle = async ({ emit, disconnect, params }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = carpark.streamSingle(params.carpark, data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};
