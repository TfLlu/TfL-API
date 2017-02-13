'use strict';

const ApiClient = require('./dist/client.js').default;

const client = new ApiClient('http://localhost:9000');
client.subscribe('/test/hallo', data => {
	console.log(data);
});