import * as carpark from '../../service/occupancy/carpark';

export const index = async ctx => {
    try {
        ctx.body = await carpark.all();
    } catch (boom) {
        ctx.body = boom.output.payload;
        ctx.status = boom.output.statusCode;
    }
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
