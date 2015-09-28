var db = require('../models/index');
var routeMiddleware = require('../middleware/routehelper');
var moment = require('moment');

app.get('/wakeups/', routeMiddleware.ensureLoggedIn, function(req, res) {
  res.redirect('/users/' + req.session.id + '/wakeups');
});

app.get('/users/:id/wakeups', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.findById(req.params.id).populate('wakeups').exec(function(err, user) {
    console.log(user);
    for (var i = 0; i < user.wakeups.length; i++) {
      user.wakeups[i].date = moment(user.wakeups[i].date).format('LL');
    }
    console.log(user);
    // console.log(moment(user.wakeups[1].date + ' ' + user.wakeups[1].time).unix() - moment(user.wakeups[2].date + ' ' + user.wakeups[2].time).unix());
    res.render('wakeups/index', {
      userid: user._id,
      wakeups: user.wakeups
    });
  });
});

app.post('/users/:id/wakeups', routeMiddleware.ensureLoggedIn, function(req, res) {
  console.log('******************Received Post: now needing to build******************');
  db.User.findById(req.params.id).populate('weather').exec(function(err, user) {
    console.log(user);
    db.Wakeup.create(req.body, function(err, wakeup) {
      if (wakeup) {
        var timeUnix = moment(wakeup.date + ' ' + wakeup.time).unix();
        var timetill = moment().unix() - timeUnix;
        var weatherParse = JSON.parse(user.weather.weatherData);
        if ((timetill * -1) < 86400) {
          console.log(timeUnix);
          var percent = weatherParse.hourly.data[Math.ceil(-1 * timetill / 3600)].precipProbability;
          wakeup.rainPercent = (percent * 100) + '%';
          wakeup.timeCall = moment(wakeup.date + ' ' + wakeup.time).subtract(60*percent, 'minutes').format('HH:mm');
        } else if ((timetill * -1) < 691200) {
          console.log(-1 * timetill / 86400);
          var percent = weatherParse.daily.data[Math.ceil(-1 * timetill / 86400)].precipProbability;
          wakeup.rainPercent = (percent * 100) + '%';
          wakeup.timeCall = moment(wakeup.date + ' ' + wakeup.time).subtract(60*percent, 'minutes').format('HH:mm');
        } else {
          wakeup.timeCall = "-:--";
        }
        wakeup.weather = user.weather;
        console.log(wakeup.weather);
        wakeup.onOff = true;
        wakeup.user = user;
        wakeup.save();
        user.wakeups.push(wakeup);
        user.save();
        res.render('wakeups/index', {
          layout: false,
          wakeups: [wakeup]
        });
        // res.redirect('/users/' + req.params.id + '/wakeups');
      } else {
        console.log('error creating wakeup');
        res.redirect('/users/' + req.params.id + '/wakeups/new');
      }
    });
  });
});

app.put('/users/:user_id/wakeups/:id', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Wakeup.findById(req.params.id, function(err, wakeup) {
    if (wakeup.onOff === false) {
      wakeup.onOff = true;
    } else {
      wakeup.onOff = false;
    }
    wakeup.save();
    res.send('100');
  });
});

app.delete('/users/:user_id/wakeups/:id', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Wakeup.findByIdAndRemove(req.params.id).exec(
    function(err, post) {
      if (err) {
        throw err;
      }
      res.send('100');
    });
});
