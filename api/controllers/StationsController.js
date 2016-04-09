/**
 * StationsController
 *
 * @description :: Server-side logic for managing stations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var stations = require('../stations.js'),
formatter = require('../stations/formatter.js');

module.exports = {

	list: function(req, res) {
		stations.list().then(function(result) {
			var format = req.param('format');
			if (format && formatter[format]) {
				result = result.map(formatter[format]);
				if (format == 'geojson') {
					result = {
						type: 'FeatureCollection',
  						features: result
					}
				}
			}
			res.json(result);
		});
	},

	get: function(req, res) {
		stations.get(req.params.id).then(function(result) {
			var format = req.param('format');
			if (format && formatter[format]) {
				result = formatter[format](result);
			}
			res.json(result);
		});
	},

	search: function(req, res) {
		stations.search(req.params.name).then(function(result) {
			var format = req.param('format');
			if (format && formatter[format]) {
				result = result.map(formatter[format]);
				if (format == 'geojson') {
					result = {
						type: 'FeatureCollection',
  						features: result
					}
				}
			}
			res.json(result);
		});
	},

	nearby: function(req, res) {
		stations.nearby(req.param('lon'), req.param('lat'), req.param('distance'))
		.then(function(result) {
			var format = req.param('format');
			if (format && formatter[format]) {
				result = result.map(formatter[format]);
				if (format == 'geojson') {
					result = {
						type: 'FeatureCollection',
  						features: result
					}
				}
			}
			res.json(result);
		});
	}

};
