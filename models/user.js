var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT = 10;

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  locationLong: {
    type: Number,
    required: true
  },
  locationLat: {
    type: Number,
    required: true
  },
  avatar: String,
  weather: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Weather',
  },
  wakeups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wakeup',
  }]
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(SALT, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      console.log('hashed');
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.statics.authenticate = function(formData, callback) {
  this.findOne({
    username: formData.username
  },
  function(err, user) {
    if (user === null) {
      callback('invaild username or password', null);
    } else {
      user.checkPassword(formData.password, callback);
    }
  });
};

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function(err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};

var User = mongoose.model('User', userSchema);
module.exports = User;
