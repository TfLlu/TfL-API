import * as carpark from '../../service/occupancy/carpark';

var streamClients = 0;

export const index = async ctx => {
    try {
        ctx.body = await carpark.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
};

export const streamCount = () => streamClients;

export const fireHose = async ({ emit, disconnect }) => {
    streamClients++;
    var res = carpark.fireHose(data => {
        emit(data);
    });

    disconnect(() => {
        streamClients--;
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
    streamClients++;
    var res = carpark.streamSingle(params.carpark, data => {
        emit(data);
    });

    disconnect(() => {
        streamClients--;
        res.off();
    });
};
