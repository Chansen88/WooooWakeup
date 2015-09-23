var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');
var session = require('cookie-session');


var db = require('./models');
loginMiddleware = require('./middleware/loginhelper');
routeMiddleware = require('./middleware/routehelper');

app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(loginMiddleware);

app.use(session({
  maxAge: 36000000,
  secret: 'hurhurhurhur',
  name: 'WakeUpApp'
}));

require('./controllers/index');

// app.listen(process.env.PORT || 3000, function(){

app.listen(3000, function() {
  console.log("Wake UPPPPPPPP @ " +  3000);
});
