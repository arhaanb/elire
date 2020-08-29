var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchoolSchema = new Schema({

	name: String,
	accessCode: String,
	time: Date,

});

module.exports = mongoose.model('School', SchoolSchema);