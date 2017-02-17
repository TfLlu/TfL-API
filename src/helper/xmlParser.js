import {parseString} from 'xml2js';

var xmlOptions = {
    async: true,
    trim: true,
    explicitArray: false
};

export default (rawData) => {

    return new Promise((resolve, reject) => {
        parseString(rawData, xmlOptions, (error, data) => {

            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });

};
