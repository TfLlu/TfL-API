import * as airquality from '../../service/weather/airquality';

var streamClients = 0;

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

export const streamCount = () => streamClients;

export const fireHose = async ({ emit, disconnect }) => {
    streamClients++;
    var res = airquality.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        streamClients--;
        res.off();
    });
};

export const streamSingle = async ({ emit, disconnect, params }) => {
    streamClients++;
    var res = airquality.streamSingle(params.weatherStation, data => {
        emit(data);
    });

    disconnect(() => {
        streamClients--;
        res.off();
    });
};
