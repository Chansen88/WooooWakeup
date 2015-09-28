var mongoose = require('mongoose');
var User = require('./user');

var wakeupSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  timeCall: String,
  onOff: Boolean,
  rainPercent: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  weather: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Weather',
  },
});

var Wakeup = mongoose.model('Wakeup', wakeupSchema);
module.exports = Wakeup;
