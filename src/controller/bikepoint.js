import * as velok from '../sources/bikepoint/velok';

export const index = async ctx => {

    ctx.body = {
        'velok': await velok.stations()
    };
};
