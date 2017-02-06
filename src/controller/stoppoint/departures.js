import * as departures from '../../service/stoppoint/departures';

export const get = async ctx => {
    ctx.body = await departures.get(
        parseInt(ctx.params.stopPoint)
    );
};

export const load = async ctx => {
    ctx.body = await departures.load(
        parseInt(ctx.params.stopPoint),
        parseInt(ctx.params.limit)
    );
};

export const streamIndex = async ({ emit, disconnect }) => {
    var res = departures.stream(data => {
        emit(data);
    });

    disconnect(() => {
        res.off();
    });
};
