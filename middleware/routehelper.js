db = require('../models');

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    } else {
      res.redirect('/users/login');
    }
  },

  ensureCorrectUser: function(req, res, next) {
    db.Post.findBy(req.params.id, function(req, res) {
      if (post.user == req.params.id) {
        res.redirect('/users');
      } else {
        return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/users');
    } else {
      return next();
    }
  },
};

module.exports = routeHelpers;
