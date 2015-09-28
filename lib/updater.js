var moment = require('moment');
var accountSid = 'ACea8b8787044aab50faba87d32fcc3b9a';
var authToken = '4hF-BRc-6m2-dVb';
//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
var db = require('../models/index');
(function() {
  db.Weather.find({}, function(err, weathers) {
    for (var i = 0; i < weathers.length; i++) {
      if (weathers[i].weatherData === undefined || moment().diff(moment(weathers[i].date + ' ' + weathers[i].time), 'hours') > 1) {
        request.get('https://api.forecast.io/forecast/b5164e1d11a70e6632afbf19e82940d7/' + weathers[i].locationLat + ',' + weathers[i].locationLong,
          function(error, response, data) {
            // console.log('updating weather');
            weathers[i].weatherData = data;
            weathers[i].time = moment();
            weathers[i].save();
          });
      }
    }
  });
  db.Wakeup.find({}).populate('weather').exec(function(err, wakeups) {
    for (var i = 0; i < wakeups.length; i++) {
      var timeUnix = moment(wakeups[i].date + ' ' + wakeups[i].time).unix();
      var timetill = moment().unix() - timeUnix;
      console.log(wakeups[i]);
      var weatherParse = JSON.parse(wakeups[i].weather.weatherData);
      if (moment(wakeups[i].date + ' ' + wakeups[i].timeCall).unix() - moment().unix() <= 0) {
        client.messages.create({
        	to: "9132336566",
        	from: "+18779587647",
        	body: "WOOOOO!!!! Woooooooooo!!! Wake UP!!!!!!!",
        }, function(err, message) {
          console.log(err);
        	console.log(message);
        });
        wakeups[i].remove();
        console.log('expired');
      } else {
        if ((timetill * -1) < 86400) {
          // console.log(timeUnix);
          var percent = weatherParse.hourly.data[Math.ceil(-1 * timetill / 3600)].precipProbability;
          wakeups[i].rainPercent = (percent * 100) + '%';
          wakeups[i].timeCall = moment(wakeups[i].date + ' ' + wakeups[i].time).subtract(60*percent, 'minutes').format('HH:mm');
        } else if ((timetill * -1) < 691200) {
          // console.log(-1 * timetill / 86400);
          var percent = weatherParse.daily.data[Math.ceil(-1 * timetill / 86400)].precipProbability;
          wakeups[i].rainPercent = (percent * 100) + '%';
          wakeups[i].timeCall = moment(wakeups[i].date + ' ' + wakeups[i].time).subtract(60*percent, 'minutes').format('HH:mm');
        } else {
          wakeups[i].timeCall = "-:--";
        }
        wakeups[i].onOff = true;
        wakeups[i].save();
      }
    }
  });
})();