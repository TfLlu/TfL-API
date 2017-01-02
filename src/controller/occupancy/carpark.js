import * as carpark from '../../service/occupancy/carpark';

export const index = async ctx => {
    ctx.body = await carpark.all();
};

export const get = async ctx => {
    ctx.body = await carpark.get(
        ctx.params.carPark
    );
};
