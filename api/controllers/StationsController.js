/**
 * StationsController
 *
 * @description :: Server-side logic for managing stations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var stations = require('../stations.js');

module.exports = {

	list: function(req, res) {
		stations.list().then(function(result) {
			res.json(result);
		});
	},

	get: function(req, res) {
		stations.get(req.params.id).then(function(result) {
			res.json(result);
		});
	}

};
