import request from 'request-promise-native';
import {parseString} from 'xml2js';
import * as velok from '../sources/bikepoint/velok';

var xmlOptions = {
    async: true,
    trim: true,
    explicitArray: false
};

export const index = async ctx => {

    ctx.body = {
        'velok': await velok.stations()
    };
};
