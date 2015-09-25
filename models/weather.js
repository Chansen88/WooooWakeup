var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var weatherSchema = new mongoose.Schema({
  locationLat: Number,
  locationLong: Number,
  time: String,
  weatherData: String,
});
weatherSchema.plugin(findOrCreate);
var Weather = mongoose.model('Weather', weatherSchema);
module.exports = Weather;
