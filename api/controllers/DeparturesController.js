/**
 * DeparturesController
 *
 * @description :: Server-side logic for managing departures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

var departuresUrl = 'http://travelplanner.mobiliteit.lu/restproxy/departureBoard'
	+ '?accessId=cdt'
	+ '&format=json'
	+ '&id=';

module.exports = {

	list: function(req, res) {
		var result = [];

		// load stations from remote url
		request(departuresUrl + req.params.id, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var departures = JSON.parse(body).Departure;
				for (var i = 0; i < departures.length; i++) {
					var departure = {};
					switch (departures[i].Product.catCode) {
						case '2':
							departure.type = 'train';
							break;
						case '5':
							departure.type = 'bus';
							break;
						default:
							departure.type = 'unknown';
							break;
					}
					departure.line = departures[i].Product.line.trim();
					departure.number = parseInt(departures[i].Product.num.trim(), 10);

					var time = Math.round(Date.parse(departures[i].date + ' ' + departures[i].time) / 1000);
					if (departures[i].rtDate) {
						var realTime = Math.round(Date.parse(departures[i].rtDate + ' ' + departures[i].rtTime) / 1000);
						departure.departure = realTime;
						departure.delay = realTime - time;
					} else {
						departure.departure = time;
						departure.delay = 0;
					}
					departure.destination = departures[i].direction;
					result.push(departure);
				}
				res.json(result);
			}
		});
	}

};
