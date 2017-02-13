import * as weather from '../service/weather';

var streamClients = 0;

export const current = async ctx => {
    try {
        ctx.body = await weather.current();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const streamCount = () => streamClients;

export const streamSingle = async ({ emit, disconnect }) => {
    streamClients++;
    var res = weather.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        streamClients--;
        res.off();
    });
};
