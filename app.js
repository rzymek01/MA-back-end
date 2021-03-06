var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var polyfills = require('./utils/polyfills');
var init = require('./utils/init');
var auth = require('./utils/auth');

var routes = require('./routes/index');
var products = require('./routes/products');
var users = require('./routes/users');
var sync = require('./routes/sync');

polyfills();
var initialised = init();
if (!initialised) {
  console.log('ERROR. App is not initialised.');
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});
app.use(function (req, res, next) {
  var data = {};
  if (auth(req.get('Authorization'), req.get('Date'), data)) {
    req.myDeviceId = data.deviceId;
    next();
  } else if ('OPTIONS' === req.method) {
    res.status(200).end();
  } else {
    res.status(401).end();
  }
});
app.use('/', routes);
app.use('/v1/products', products);
app.use('/v1/users', users);
app.use('/v1/sync', sync);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
