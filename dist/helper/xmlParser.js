'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _xml2js = require('xml2js');

var xmlOptions = {
    async: true,
    trim: true,
    explicitArray: false
};

exports.default = rawData => {

    return new Promise((resolve, reject) => {
        (0, _xml2js.parseString)(rawData, xmlOptions, (error, data) => {

            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};