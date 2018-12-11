var express = require('express');
var cors = require("cors");
var multer  = require('multer'),
  i18n = require('./config/i18n'),
  db = require('./config/db');
var mongoose = require('mongoose');
require('mongoose-moment')(mongoose);

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();
app.use(i18n);

require('./config/express')(app, isProduction);
require('./config/db');
require('./models');
require('./config/passport');

app.use(require('./routes'));
app.use(cors({credentials: true, origin: true}));
app.options('*', cors({credentials: true, origin: true}));
/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});

require('./initialize');

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + server.address().port);
});
module.exports = app;