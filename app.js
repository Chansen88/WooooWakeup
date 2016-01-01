var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');
var session = require('cookie-session');
var moment = require('moment');

var db = require('./models');
loginMiddleware = require('./middleware/loginhelper');
routeMiddleware = require('./middleware/routehelper');

moment().format();
app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.engine('handlebars', hbs.engine);
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

app.listen(process.env.PORT || 3000, function() {
  console.log("Wake UPPPPPPPP @ " +  process.env.PORT || 3000);
});
