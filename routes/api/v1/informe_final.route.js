var router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/informe_final.controller.js');

require('./base/base.route')(router, '/informe_final', controller, permission.adminOnly(true));

module.exports = router;