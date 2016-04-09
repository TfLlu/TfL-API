var request = require('request'),
    querystring = require('querystring'),
    Q = require('q');

var distance = function(lat1, lon1, lat2, lon2) {
	var R = 6378137;
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
    console.log(d);
    return d;
}

var apiHost = 'http://travelplanner.mobiliteit.lu';
var apiEndpoint = '/hafas/query.exe/dot';
var apiQuery = {
    performLocating: 2,
    tpl: 'stop2csv',
    look_maxdist: 9999999999,
    look_x: 6112550,
    look_y: 49610700,
    stationProxy: 'yes'
};

var stationsCache;

module.exports = {

	list: function(query) {
        if (!query && stationsCache)
            return stationsCache;

		var result = [];
        var deferred = Q.defer();
        if (!query)
            stationsCache = deferred.promise;

        query = Object.assign({}, apiQuery, query || {});

		// load stations from remote url
		request(apiHost + apiEndpoint + '?' + querystring.stringify(query), function (error, response, body) {
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

        return deferred.promise;
	},

	get: function(id) {
        return this.list().then(function(stations) {
            for (var i = 0; i < stations.length; i++) {
                if (stations[i].id == id)
                    return stations[i];
            }
            return null;
        });
	},

    search: function(name) {
        name = name.toLowerCase();
        return this.list().then(function(stations) {
            return stations.filter(function(station) {
                return station.name.toLowerCase().indexOf(name) >= 0;
            });
        });
    },

    nearby: function(lon, lat, maxDistance) {
        maxDistance = maxDistance || 1000;
        return this.list().then(function(stations) {
            return stations.filter(function(station) {
                return distance(
                    parseFloat(lat),
                    parseFloat(lon),
                    station.latitude,
                    station.longitude
                ) <= maxDistance;
            });
        });
    }

};
