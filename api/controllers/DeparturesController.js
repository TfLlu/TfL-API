/**
 * DeparturesController
 *
 * @description :: Server-side logic for managing departures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var departures = require('../departures.js');

module.exports = {

	list: function(req, res) {
		departures.list(req.params.id).then(function(result) {
			res.json(result);
		});
	}

};
