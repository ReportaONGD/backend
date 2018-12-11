let i18n = require("i18n");

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'es'],

  // you may alter a site wide default locale
  defaultLocale: 'en',


  // where to store json files - defaults to './locales' relative to modules directory
  directory: './locales',

  // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
  // extension: '.js',

  // setting of log level DEBUG - default to require('debug')('i18n:debug')
  logDebugFn: function (msg) {
    console.log('debug', msg);
  },

  // setting of log level WARN - default to require('debug')('i18n:warn')
  logWarnFn: function (msg) {
    console.log('warn', msg);
  },

  // setting of log level ERROR - default to require('debug')('i18n:error')
  logErrorFn: function (msg) {
    console.log('error', msg);
  },

  // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
  register: global,

  objectNotation: true,

  // hash to specify different aliases for i18n's internal methods to apply on the request/response objects (method -> alias).
  // note that this will *not* overwrite existing properties with the same name
  api: {
    '__': 't',  //now req.__ becomes req.t
    '__n': 'tn' //and req.__n can be called as req.tn
  }
});

module.exports = function(req, res, next) {

  i18n.init(req, res);

  return next();
};
