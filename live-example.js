io.socket.on('update', function gotUpdate (data) {
    console.log(data);
});

io.socket.get('/departures/live/200405035', function gotResponse(body, response) {
    console.log('Server responded with status code ' + response.statusCode + ' and data: ', body);
});
