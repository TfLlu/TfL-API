import axios from 'axios';
import { requestTime } from './monitor';

const request = axios.create({
    responseType: 'text',
    timeout: 1000 // 5000
});

request.interceptors.request.use(config => {
    config.startTime = Date.now();
    return config;
});

request.interceptors.response.use(response => {
    response.config.endTime = Date.now();
    requestTime(response);
    return response;
});

export default request;
