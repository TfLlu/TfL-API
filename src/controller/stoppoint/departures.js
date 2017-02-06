import * as departures from '../../service/stoppoint/departures';

export const get = async ctx => {
    try {
        ctx.body = await departures.get(
            parseInt(ctx.params.stopPoint)
        );
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const load = async ctx => {
    try {
        ctx.body = await departures.load(
            parseInt(ctx.params.stopPoint),
            parseInt(ctx.params.limit)
        );
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const streamIndex = async ({ emit, disconnect }) => {
    var res = departures.stream(data => {
        emit(data);
    });

    disconnect(() => {
        res.off();
    });
};
