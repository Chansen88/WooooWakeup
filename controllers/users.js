
var GoogleMapsAPI = require('googlemaps');
var db = require('../models/index');
var loginMiddleware = require('../middleware/loginhelper');
var routeMiddleware = require('../middleware/routehelper');
var publicConfig = {
  key: 'KEY',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
  proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests
};
var gmAPI = new GoogleMapsAPI(publicConfig);


app.get('/users', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.findById(req.session.id, function(err, user) {
    var params = {
      center: user.locationLat + ',' + user.locationLong,
      zoom: 15,
      size: '300x200',
      maptype: 'roadmap',
      markers: [
        {
          location: user.locationLat + ',' + user.locationLong,
          color: 'green',
          shadow: true
        }
      ]
    };
    user.mapUrl = gmAPI.staticMap(params);

    res.render('users/index', {user: user});
  });
});

app.get('/users/signup', routeMiddleware.preventLoginSignup, function(req, res) {
  res.render('users/signup');
});

app.post('/users/signup', routeMiddleware.preventLoginSignup, function(req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function(err, user) {
    if (user) {
      req.login(user);
      res.redirect('/users');
    } else {
      console.log('Create User: ERROR');
      res.redirect('/users/signup');
    }
  });
});

app.get('/users/login', routeMiddleware.preventLoginSignup, function(req, res) {
  res.render('users/login');
});

app.post('/users/login', routeMiddleware.preventLoginSignup, function(req, res) {
  db.User.authenticate(req.body.user, function(err, user) {
      if (!err && user !== null) {
        req.login(user);
        res.redirect('/users');
      } else {
        res.redirect('/users/login');
      }
    });
});

app.get('/users/edit', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.findById(req.session.id, function(err,user) {
    res.render('users/edit', {user: user});
  });
});

app.put('/users', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.findByIdAndUpdate(req.session.id, req.body.user, function(err, user) {
    if (err) {
      res.redirect('/users/edit');
    } else {
      res.redirect('/users');
    }
  });
});

app.get('/users/logout', function(req, res) {
  req.logout();
  res.redirect('/users');
});
