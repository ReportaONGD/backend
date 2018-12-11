var router = require('express').Router();
let permission = require('../../permission');

const controller = require('../../../controllers/estados_informe.controller.js');

require('./base/base.route')(router, '/estados_informe', controller, permission.adminOnly(true));

module.exports = router;
