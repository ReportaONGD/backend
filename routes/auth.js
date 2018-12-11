const jwt = require('express-jwt');
const secret = require('../config/env').secret;
const auth_util = require('../utils/auth');

var auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: auth_util.getTokenFromHeader
  }).unless({ path: ['/api/v1/users/login'] }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: auth_util.getTokenFromHeader
  })
};

module.exports = auth;
