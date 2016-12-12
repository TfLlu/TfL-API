import request from 'request-promise-native';
import xmlParser from '../../helpers/xmlParser';

const getRaw = () => request('https://webservice.velok.lu/station.aspx');

export const get = async () => {
    var raw = await getRaw();
    var data = await xmlParser(raw);

    return data['velok']['station'];
};

export const stations = async () => {
    var stations = await get();
    return stations.map(compileStation);
};

export const compileStation = item => {
    return item;
};
