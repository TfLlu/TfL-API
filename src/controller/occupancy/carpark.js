import * as carpark from '../../service/occupancy/carpark';

export const index = async ctx => {
    ctx.body = await carpark.items();
};

export const show = async ctx => {
    ctx.body = await carpark.item(ctx.params.item);
};
