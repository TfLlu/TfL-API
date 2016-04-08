/**
 * StationsController
 *
 * @description :: Server-side logic for managing stations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

var stationsUrl = 'http://travelplanner.mobiliteit.lu'
	+ '/hafas/query.exe/dot'
  	+ '?performLocating=2'
  	+ '&tpl=stop2csv'
  	+ '&look_maxdist=150000'
  	+ '&look_x=6112550'
  	+ '&look_y=49610700'
  	+ '&stationProxy=yes';

module.exports = {

	list: function(req, res) {
		var result = [];

		// load stations from remote url
		request(stationsUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var stations = body.split("\n");
				for (var i = 0; i < stations.length; i++) {
					var paramParts = stations[i].split('@');
					var params = {};
					for (var j = 0; j < paramParts.length; j++) {
						var keyVal = paramParts[j].split('=', 2);
						params[keyVal[0]] = keyVal[1];
					}
					result.push({
						id: params.L,
						name: params.O,
						longitude: params.X,
						latitude: params.Y
					});
				}

				res.json(result);
			}
		});

	}

};
