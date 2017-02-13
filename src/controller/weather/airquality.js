import * as airquality from '../../service/weather/airquality';

var streamClients = 0;

export const index = async ctx => {
    try {
        ctx.body = await airquality.current();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const streamCount = () => streamClients;

export const streamSingle = async ({ emit, disconnect }) => {
    streamClients++;
    var res = airquality.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        streamClients--;
        res.off();
    });
};
