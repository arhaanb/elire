var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogsSchema = new Schema({

	username: String,
	action: String,
	time: Date,
	category: String,
	level: Number

});


var Logs = mongoose.model('Logs', LogsSchema);
module.exports = Logs;