var router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/implementador.controller.js');

require('./base/base.route')(router, '/implementador', controller, permission.adminOnly(true));

module.exports = router;
 