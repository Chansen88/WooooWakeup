var mongoose = require('mongoose');
var User = require('./user');

var wakeupSchema = new mongoose.Schema({
    time: String,
    wakeuptune: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
});

wakeupSchema.pre('remove', function(callback){
  User.remove({wakeups: this._id}).exec();
  callback();
});

var Wakeup = mongoose.model("Wakeup", wakeupSchema);
module.exports = Wakeup;
