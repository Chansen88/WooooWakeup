//will delete this page

var db = require('../models/index');
var routeMiddleware = require('../middleware/routehelper');
var moment = require('moment');
var request = require('request');

function rainPercentage(weather) {
  var results = [];
  var sum = 0;
  console.log(weather);
  if (weather.minutely) {
    for (var i = 0; i < weather.minutely.data.length; i++) {
      sum += weather.minutely.data[i].precipProbability;
    }
    results.push(Math.floor(sum / weather.hourly.data.length * 100) + '%');
  } else {
    results.push(Math.floor(weather.currently.precipProbability * 100) + '%');
  }
  if (weather.hourly) {
    for (var i = 0; i < weather.hourly.data.length; i++) {
      sum += weather.hourly.data[i].precipProbability;
    }
    results.push(Math.floor(sum / weather.hourly.data.length * 100) + '%');
  } else {
    results.push(Math.floor(weather.currently.precipProbability * 100) + '%');
  }
  return results;
}
//Build weather here
//Get weather
app.get('/users/:id/weathers', routeMiddleware.ensureLoggedIn,
  function(req, res) {
    db.User.findById(req.session.id, function(err, user) {
      db.Weather.findOrCreate({locationLat: user.locationLat, locationLong: user.locationLong}, function(err, weather, created) {
        if (weather.weatherData === undefined || moment().diff(moment(weather.date + ' ' + weather.time), 'hours') > 1) {
          request.get('https://api.forecast.io/forecast/b5164e1d11a70e6632afbf19e82940d7/' + weather.locationLat + ',' + weather.locationLong,
            function(error, response, data) {
              console.log('updating weather');
              weather.weatherData = data;
              weather.time = moment();
              weather.save();
              user.weather = weather;
              user.save();
              var weatherparse = JSON.parse(weather.weatherData);
              var rainPercentageData = rainPercentage(weatherparse);
              res.render('weathers/index', {layout: false, weather: weatherparse, hour: rainPercentageData[0], day: rainPercentageData[1]});
            });
        } else {
          console.log('uptoDate');
          var weatherparse = JSON.parse(weather.weatherData);
          var rainPercentageData = rainPercentage(weatherparse);
          res.render('weathers/index', {layout: false, weather: weatherparse, hour: rainPercentageData[0], day: rainPercentageData[1]});
        }
      });
  });
});
