import request from 'request-promise-native';
//var parseString = require('xml2js').parseString;
//import xml2js from 'xml2js';
import {parseString} from 'xml2js';

//var xmlParser = new xml2js.Parser().parseString;
var xmlOptions = {
    async: true,
    trim: true,
    explicitArray: false
};

export const index = async ctx => {



    //const result = await request('https://api.jcdecaux.com/vls/v1/stations?contract=Luxembourg&apiKey=1835af14f29db63b765a3335ba42891323ce8f12');

    const result = await request('https://webservice.velok.lu/station.aspx');

    return new Promise((resolve, reject) => {
        parseString(result, xmlOptions, (error, data) => {

            if (error) {
                reject(error);
            }

            ctx.body = {
                'hello': 'world',
                'data': data['velok']['station']
            };
            resolve();
        });
    });

    //ctx.body = result;

    //ctx.body = '<h1>Hello Bikepoint \\o/' + ctx.params.id + '</h1>';
};

/*const get = function(bla) {
    return 'test [' + bla + '] done...';
};
*/
