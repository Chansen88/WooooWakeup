var moment = require('moment');
var forecastToken = '';
var accountSid = '';
var authToken = '';
var client = require('twilio')(accountSid, authToken);
var db = require('../models/index');

(function() {
  db.Weather.find({}, function(err, weathers) {
    for (var i = 0; i < weathers.length; i++) {
      if (weathers[i].weatherData === undefined || moment().diff(moment(weathers[i].date + ' ' + weathers[i].time), 'hours') > 1) {
        request.get('https://api.forecast.io/forecast/' + forecastToken + '/' + weathers[i].locationLat + ',' + weathers[i].locationLong,
          function(error, response, data) {
            weathers[i].weatherData = data;
            weathers[i].time = moment();
            weathers[i].save();
          });
      }
    }
  });
  db.Wakeup.find({}).populate('weather').populate('user').exec(function(err, wakeups) {
    for (var i = 0; i < wakeups.length; i++) {
      var timeUnix = moment(wakeups[i].date + ' ' + wakeups[i].time).unix();
      var timetill = moment().unix() - timeUnix;
      var weatherParse = JSON.parse(wakeups[i].weather.weatherData);
      if (moment(wakeups[i].date + ' ' + wakeups[i].timeCall).unix() - moment().unix() <= 600) {
        client.messages.create({
        	to: wakeups[i].user.phoneNumber,
        	from: "+18779587647",
          body: "WOOOOO!!!! Woooooooooo!!! Wake UP!!!!!!!",
        }, function(err, message) {
          console.log(err);
          console.log(message);
        });
        wakeups[i].remove();
      } else {
        if ((timetill * -1) < 86400) {
          var percent = weatherParse.hourly.data[Math.ceil(-1 * timetill / 3600)].precipProbability;
          wakeups[i].rainPercent = (percent * 100) + '%';
          wakeups[i].timeCall = moment(wakeups[i].date + ' ' + wakeups[i].time).subtract(60*percent, 'minutes').format('HH:mm');
        } else if ((timetill * -1) < 691200) {
          var percent = weatherParse.daily.data[Math.ceil(-1 * timetill / 86400)].precipProbability;
          wakeups[i].rainPercent = (percent * 100) + '%';
          wakeups[i].timeCall = moment(wakeups[i].date + ' ' + wakeups[i].time).subtract(60*percent, 'minutes').format('HH:mm');
        } else {
          wakeups[i].timeCall = "-:--";
        }
        wakeups[i].save();
      }
    }
  });
})();
