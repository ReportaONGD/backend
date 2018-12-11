var router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/financiador.controller.js');

require('./base/base.route')(router, '/financiador', controller, permission.adminOnly(true));

module.exports = router;
