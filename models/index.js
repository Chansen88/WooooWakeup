var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/wakeup');

module.exports.User = require('./user');
module.exports.Wakeup = require('./wakeup');
module.exports.Weather = require('./weather');
