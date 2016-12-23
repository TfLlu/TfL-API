import * as occupancy from '../service/occupancy';

export const index = async ctx => {
    ctx.body = await occupancy.items();
};

export const show = async ctx => {
    ctx.body = await occupancy.item(ctx.params.item);
};
