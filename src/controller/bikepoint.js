import * as bikepoint from '../service/bikepoint';

export const index = async ctx => {
    ctx.body = await bikepoint.all();
};

export const streamIndex = async ({ emit, disconnect }) => {
    var res = bikepoint.stream(data => {
        emit(data);
    });

    disconnect(() => {
        res.off();
    });
};

export const get = async ctx => {
    ctx.body = await bikepoint.get(ctx.params.bikePoint);
};

export const around = async ctx => {
    ctx.body = await bikepoint.around(
        parseFloat(ctx.params.lon),
        parseFloat(ctx.params.lat),
        ctx.params.radius
    );
};

export const box = async ctx => {
    ctx.body = await bikepoint.box(
        parseFloat(ctx.params.swlon),
        parseFloat(ctx.params.swlat),
        parseFloat(ctx.params.nelon),
        parseFloat(ctx.params.nelat)
    );
};

export const search = async ctx => {
    ctx.body = await bikepoint.search(
        ctx.params.searchstring.toLowerCase()
    );
};
