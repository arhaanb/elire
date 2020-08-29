var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HintsSchema = new Schema({
    level: Number,
    hintText: String,
    time: Date,
    hintNumber: Number,
    imgLink: String
});



var Hints = mongoose.model('Hints', HintsSchema);
module.exports = Hints;
