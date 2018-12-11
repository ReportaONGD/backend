var router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/socio_local.controller.js');

require('./base/base.route')(router, '/socio_local', controller, permission.adminOnly(true));

module.exports = router;
