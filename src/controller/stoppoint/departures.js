import * as departures from '../../service/stoppoint/departures';
import config          from '../../config';
import {redis}         from '../../redis';

const STREAM_CLIENTS_KEY = config('NAME_VERSION', true) + '_stream_clients_stoppoint_departures';
const CACHE_AGENCIES     = config('NAME_VERSION', true) + '_cache_agencies';

export const index = async ctx => {
    try {
        ctx.body = await departures.index();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const get = async ctx => {
    try {
        ctx.body = await departures.loadPlanes(
            parseInt(ctx.params.stopPoint)
        );
        /*ctx.body = await departures.get(
            parseInt(ctx.params.stopPoint)
        );*/
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const limit = async ctx => {
    try {
        var cache_count = parseInt(config('CRAWL_STOPPOINT_DEPARTURE_AMOUNT', true));
        if (ctx.params.limit == cache_count) {
            ctx.body = await departures.get(
                parseInt(ctx.params.stopPoint)
            );
        } else if (ctx.params.limit <= cache_count) {
            ctx.body = JSON.parse(
                await departures.get(
                    parseInt(ctx.params.stopPoint)
                )
            ).slice(0, parseInt(ctx.params.limit));
        } else {
            ctx.body = await departures.load(
                parseInt(ctx.params.stopPoint),
                parseInt(ctx.params.limit),
                JSON.parse(await redis.get(CACHE_AGENCIES))
            );
        }
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const fireHose = async ({ emit, disconnect }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = departures.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};

export const streamSingle = async ({ emit, disconnect, params }) => {
    redis.incr(STREAM_CLIENTS_KEY);
    var res = departures.streamSingle(parseInt(params.stopPoint), data => {
        emit(data);
    });

    disconnect(() => {
        redis.decr(STREAM_CLIENTS_KEY);
        res.off();
    });
};
