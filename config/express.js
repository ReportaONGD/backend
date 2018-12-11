var express = require('express'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  cors = require('cors');

module.exports = function (app, isProduction) {
  app.use(cors());
  // Normal express config defaults
  app.use(require('morgan')('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(function (err, req, res, next) {

    if (err) {
      return res.status(500).json({ 'error': req.t('Incorrect Format') });
    }

    next();
  });

  app.use(require('method-override')());

  if (!isProduction) {
    app.use(errorhandler());
  }
};
