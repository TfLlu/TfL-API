var request = require('request'),
    Q = require('q');

var stationsUrl = 'http://travelplanner.mobiliteit.lu'
	+ '/hafas/query.exe/dot'
  	+ '?performLocating=2'
  	+ '&tpl=stop2csv'
  	+ '&look_maxdist=150000'
  	+ '&look_x=6112550'
  	+ '&look_y=49610700'
  	+ '&stationProxy=yes';

var stationsCache;

module.exports = {

	list: function() {
        if (stationsCache)
            return stationsCache;

		var result = [];
        var deferred = Q.defer();

		// load stations from remote url
		request(stationsUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var stations = body.trim().split("\n");
				for (var i = 0; i < stations.length; i++) {
					var paramParts = stations[i].split('@');
					var params = {};
					for (var j = 0; j < paramParts.length; j++) {
						var keyVal = paramParts[j].split('=', 2);
						params[keyVal[0]] = keyVal[1];
					}
					result.push({
						id: parseInt(params.L, 10),
						name: params.O,
						longitude: parseFloat(params.X.replace(',', '.')),
						latitude: parseFloat(params.Y.replace(',', '.'))
					});
				}

				// sort result by id
				result.sort(function(a, b) {
  					return a.id - b.id;
				});

				deferred.resolve(result);
			} else {
                deferred.reject(new Error(error));
            }
		});

        stationsCache = deferred.promise;
        return stationsCache;
	},

	get: function(id) {
        return this.list().then(function(stations) {
            for (var i = 0; i < stations.length; i++) {
                if (stations[i].id == id)
                    return stations[i];
            }
            return null;
        });
	}

};
