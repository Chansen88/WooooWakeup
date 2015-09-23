var mongoose = require('mongoose');

var weatherSchema = new mongoose.Schema({
  locationLat: String,
  locationLong: String,
  time: String,
  weatherData: String,
});

var Weather = mongoose.model("Weather", wakeupSchema);
module.exports = Weather; 
