/**
 * DeparturesController
 *
 * @description :: Server-side logic for managing departures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var departures = require('../departures.js'),
	live = require('../departures/live.js');

module.exports = {

	list: function(req, res) {
		departures.list(req.params.id).then(function(result) {
			res.json(result);
		});
	},

    live: function(req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }
		var id = req.param('id');
		live.add(id, req);

        return res.ok();
    }

};
