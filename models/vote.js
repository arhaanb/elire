var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VotesSchema = new Schema({

	forwho: String,
	bywho: String,
	time: Date

});

module.exports = mongoose.model('Votes', VotesSchema);