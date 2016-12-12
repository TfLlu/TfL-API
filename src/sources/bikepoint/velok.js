import request from 'request-promise-native';
import {parseString} from 'xml2js';

var xmlOptions = {
    async: true,
    trim: true,
    explicitArray: false
};

const getRaw = () => request('https://webservice.velok.lu/station.aspx');

export const get = async () => {

    var raw = await getRaw();

    return new Promise((resolve, reject) => {
        parseString(raw, xmlOptions, (error, data) => {

            if (error) {
                reject(error);
            }
            resolve(data['velok']['station']);
        });
    });
};

export const stations = async () => {
    var stations = await get();
    return stations.map(compileStation);
};

export const compileStation = item => {
    return item;
};
