import * as departures from '../../service/stoppoint/departures';

var streamClients = 0;

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

export const streamCount = () => streamClients;

export const streamIndex = async ({ emit, disconnect }) => {
    streamClients++;
    var res = departures.stream(data => {
        emit(data);
    });

    disconnect(() => {
        streamClients--;
        res.off();
    });
};
